import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Load knowledge base
let knowledgeBase: any = null;

function loadKnowledgeBase() {
    if (!knowledgeBase) {
        const filePath = path.join(process.cwd(), 'public', 'chatbot-knowledge.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        knowledgeBase = JSON.parse(fileContent);
    }
    return knowledgeBase;
}

// Search knowledge base for relevant context
function searchKnowledgeBase(query: string, userContext?: string): string {
    const kb = loadKnowledgeBase();
    const queryLower = query.toLowerCase();
    const keywords = queryLower.split(' ').filter(word => word.length > 3);

    let relevantFAQs: any[] = [];
    let scores: Map<string, number> = new Map();

    // Search through all categories
    Object.keys(kb.categories).forEach(categoryKey => {
        const category = kb.categories[categoryKey];

        category.faqs.forEach((faq: any) => {
            let score = 0;

            // Check if question matches
            if (faq.question.toLowerCase().includes(queryLower)) {
                score += 10;
            }

            // Check keywords
            faq.keywords.forEach((keyword: string) => {
                if (queryLower.includes(keyword.toLowerCase())) {
                    score += 5;
                }
            });

            // Check individual query words
            keywords.forEach(word => {
                if (faq.question.toLowerCase().includes(word) ||
                    faq.answer.toLowerCase().includes(word)) {
                    score += 2;
                }
            });

            // Boost score if category matches user context
            if (userContext && categoryKey.includes(userContext.toLowerCase())) {
                score += 3;
            }

            if (score > 0) {
                scores.set(faq.id, score);
                relevantFAQs.push({ ...faq, category: category.name, score });
            }
        });
    });

    // Sort by score and take top 3
    relevantFAQs.sort((a, b) => b.score - a.score);
    const topFAQs = relevantFAQs.slice(0, 3);

    // Build context string
    if (topFAQs.length === 0) {
        return 'No specific FAQ found in knowledge base.';
    }

    let context = 'Relevant information from knowledge base:\n\n';
    topFAQs.forEach((faq, index) => {
        context += `${index + 1}. Q: ${faq.question}\n   A: ${faq.answer}\n   Category: ${faq.category}\n\n`;
    });

    return context;
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
        const kbContext = searchKnowledgeBase(message, userPanel);

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

Knowledge Base Context:
${kbContext}

User's Question: ${message}

Please provide a helpful, accurate response based on the knowledge base context. If the context doesn't contain relevant information, provide a general helpful response or suggest contacting support.`;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(systemPrompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({
            response: text,
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
