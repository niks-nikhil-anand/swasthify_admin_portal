import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Load knowledge base embeddings
let kbEmbeddings: any[] | null = null;

function loadKbEmbeddings() {
    if (!kbEmbeddings) {
        try {
            const filePath = path.join(process.cwd(), 'public', 'chatbot-embeddings.json');
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            kbEmbeddings = JSON.parse(fileContent);
        } catch (error) {
            console.error('Failed to load embeddings:', error);
            kbEmbeddings = [];
        }
    }
    return kbEmbeddings;
}

// Cosine similarity
function cosineSimilarity(vecA: number[], vecB: number[]) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Search knowledge base using embeddings
async function searchKnowledgeBase(query: string, userContext?: string): Promise<string> {
    const embeddings = loadKbEmbeddings();
    if (!embeddings || embeddings.length === 0) {
        return "Knowledge base not available.";
    }

    try {
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(query);
        const queryEmbedding = result.embedding.values;

        const scoredDocs = embeddings.map((doc: any) => ({
            ...doc,
            score: cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        // Sort by score descending
        scoredDocs.sort((a: any, b: any) => b.score - a.score);

        // Take top 5 relevant chunks
        const topDocs = scoredDocs.slice(0, 5);

        if (topDocs.length === 0 || topDocs[0].score < 0.3) {
            return "No highly relevant information found in knowledge base.";
        }

        let context = 'Relevant information from knowledge base:\n\n';
        topDocs.forEach((doc: any, index: number) => {
            context += `${index + 1}. Q: ${doc.original.question}\n   A: ${doc.original.answer}\n   Category: ${doc.category}\n\n`;
        });

        return context;
    } catch (error) {
        console.error("Error performing similarity search:", error);
        return "Error searching knowledge base.";
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, context } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required and must be a string' },
                { status: 400 }
            );
        }

        // Check if Gemini API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key not configured' },
                { status: 500 }
            );
        }

        // Search knowledge base for relevant context
        const userPanel = context?.panel || '';
        const kbContext = await searchKnowledgeBase(message, userPanel);

        // Construct prompt with context
        const systemPrompt = `You are a helpful AI assistant for the Swasthify Admin Portal, a healthcare management platform. 
Your role is to help users (doctors, lab partners, and administrators) navigate the platform and answer their questions.

Platform Overview:
- Swasthify connects doctors, diagnostic labs, and patients
- Doctors can create campaigns, manage appointments, and update profiles
- Lab partners can offer test packages, manage bookings, and provide sample collection services
- Super admins oversee the platform, verify users, and manage permissions

Guidelines:
1. Be friendly, professional, and concise
2. Use the knowledge base context provided below to answer questions accurately
3. If the question is outside your knowledge base, politely say you don't have that specific information and suggest contacting support
4. Provide step-by-step instructions when relevant
5. If asked about technical issues, provide basic troubleshooting steps
6. Always maintain user privacy and security

IMPORTANT: You must respond in valid JSON format with the following structure:
{
  "response": "Your answer here...",
  "suggestions": ["Question 1", "Question 2", "Question 3", "Question 4"]
}
The "suggestions" array must contain exactly 4 short, relevant follow-up questions or actions based on your response and the context.

Knowledge Base Context:
${kbContext}

User's Question: ${message}

Please provide a helpful, accurate response based on the knowledge base context. If the context doesn't contain relevant information, provide a general helpful response or suggest contacting support.`;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
            generationConfig: {
                responseMimeType: "application/json"
            }
        });
        const response = await result.response;
        const text = response.text();

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(text);
        } catch (e) {
            // Fallback if JSON parsing fails
            parsedResponse = {
                response: text,
                suggestions: []
            };
        }

        return NextResponse.json({
            response: parsedResponse.response,
            suggestions: parsedResponse.suggestions || [],
            timestamp: new Date().toISOString(),
        });

    } catch (error: any) {
        console.error('Chatbot API Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to process your request',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
