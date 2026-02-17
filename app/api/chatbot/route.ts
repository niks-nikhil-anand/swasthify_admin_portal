import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Canonical Answer Cache
const canonicalCache = new Map<string, any>();

function normalizeQuery(query: string): string {
    return query.toLowerCase().trim().replace(/[?.!]+$/, '');
}

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

    // 1. Filter by Category (Metadata Filtering)
    // Map user context (panel) to allowed categories
    const allowedCategories = new Set(['general', 'troubleshooting']);
    if (userContext === 'doctor') allowedCategories.add('Doctor Panel');
    else if (userContext === 'lab') allowedCategories.add('Lab Panel');
    else if (userContext === 'admin') allowedCategories.add('Super Admin');

    // FAQ Fast-Path: Detect definition queries
    const queryLower = query.toLowerCase();
    const isDefinitionQuery =
        queryLower.startsWith("who") ||
        queryLower.startsWith("what") ||
        queryLower.includes("platform") ||
        queryLower.includes("about");

    // Filter embeddings
    const filteredEmbeddings = embeddings.filter((doc: any) =>
        (isDefinitionQuery ? doc.category === 'General Information' : true) &&
        (allowedCategories.has(doc.category) || doc.category === 'General Information' || doc.category === 'Troubleshooting')
    );

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
        const result = await model.embedContent(query);
        const queryEmbedding = result.embedding.values;

        const scoredDocs = filteredEmbeddings.map((doc: any) => ({
            ...doc,
            score: cosineSimilarity(queryEmbedding, doc.embedding)
        }));

        // Sort by score descending
        // Sort by score descending
        scoredDocs.sort((a: any, b: any) => b.score - a.score);

        // 2a. Filter Low-Signal Documents
        const validDocs = scoredDocs.filter((doc: any) => doc.score >= 0.45);

        // 2b. Adaptive Retrieval
        const topScore = validDocs.length > 0 ? validDocs[0].score : 0;
        const topCategory = validDocs.length > 0 ? validDocs[0].category : '';

        let topDocs = [];

        // Lower threshold for "General" content queries
        if (topCategory === 'General Information' && topScore > 0.70) {
            topDocs = validDocs.slice(0, 1);
        } else if (topScore > 0.80) {
            topDocs = validDocs.slice(0, 1);
        } else {
            topDocs = validDocs.slice(0, 2);
        }

        // 2c. Semantic De-duplication
        if (topDocs.length > 1) {
            const uniqueDocs = [topDocs[0]];
            for (let i = 1; i < topDocs.length; i++) {
                const currentDoc = topDocs[i];
                const isRedundant = uniqueDocs.some(existing =>
                    cosineSimilarity(currentDoc.embedding, existing.embedding) > 0.9
                );
                if (!isRedundant) {
                    uniqueDocs.push(currentDoc);
                } else {
                    console.log(`Skipping redundant doc [${currentDoc.id}] (Similarity > 0.9)`);
                }
            }
            topDocs = uniqueDocs;
        }

        console.log(`Top Score: ${topScore.toFixed(4)} | Retrieving: ${topDocs.length} docs`);
        topDocs.forEach((doc: any, i: number) => {
            console.log(`  ${i + 1}. [${doc.id}] Score: ${doc.score.toFixed(4)} - ${doc.category}`);
        });

        if (topDocs.length === 0) {
            console.log("No relevant documents found (threshold 0.45)");
            return "No highly relevant information found in knowledge base.";
        }

        let context = '';
        topDocs.forEach((doc: any, index: number) => {
            context += `Q: ${doc.original.question}\nA: ${doc.original.answer}\n\n`;
        });

        return context.trim(); // Trim to remove trailing newlines
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
        console.log(`\n--- Chatbot Request Analysis ---`);
        console.log(`User Query: "${message}"`);

        // Check Cache
        const normalizedQuery = normalizeQuery(message);
        if (canonicalCache.has(normalizedQuery)) {
            console.log(`Cache HIT for query: "${normalizedQuery}"`);
            const cachedResponse = canonicalCache.get(normalizedQuery);
            return NextResponse.json({
                response: cachedResponse.response,
                suggestions: cachedResponse.suggestions || [],
                timestamp: new Date().toISOString(),
                cached: true
            });
        }

        const userPanel = context?.panel || '';
        const kbContext = await searchKnowledgeBase(message, userPanel);

        console.log(`Context Length: ${kbContext.length} characters`);

        // Optimised System Prompt (Answer-First + Length Caps)
        const systemPrompt = `You are Swasthify AI. Answer the user query based ONLY on the provided Context.

Context:
${kbContext}

User Query: ${message}

Instructions:
1. If the Context contains the answer, provide it immediately.
2. For informational queries (what/who/how), keep the answer under 80 words (3-5 bullet points).
3. If Context is missing/irrelevant, output "I don't have that information" and suggest support.
4. Do NOT ramble or add filler.

Output JSON format:
{
  "response": "Direct answer...",
  "suggestions": ["Follow-up Q1", "Follow-up Q2", "Follow-up Q3", "Follow-up Q4"]
}`;

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

        // Log Token Usage
        if (response.usageMetadata) {
            console.log(`Token Usage:`);
            console.log(`- Prompt Tokens: ${response.usageMetadata.promptTokenCount}`);
            console.log(`- Response Tokens: ${response.usageMetadata.candidatesTokenCount}`);
            console.log(`- Total Tokens: ${response.usageMetadata.totalTokenCount}`);
        } else {
            console.log(`Token usage metadata not available.`);
        }
        console.log(`--------------------------------\n`);

        let parsedResponse;
        try {
            parsedResponse = JSON.parse(text);
            // Store in cache
            canonicalCache.set(normalizedQuery, parsedResponse);
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
            timestamp: new Date().toISOString()
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
