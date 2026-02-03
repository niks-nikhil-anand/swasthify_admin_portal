import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FAQ {
    id: string;
    question: string;
    answer: string;
    keywords: string[];
    relatedTopics: string[];
}

interface Category {
    name: string;
    faqs: FAQ[];
}

interface KnowledgeBase {
    categories: {
        [key: string]: Category;
    };
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const panel = searchParams.get('panel') || 'general';

        // Load knowledge base
        const filePath = path.join(process.cwd(), 'public', 'chatbot-knowledge.json');
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const knowledgeBase: KnowledgeBase = JSON.parse(fileContent);

        // Determine which categories to use based on panel
        let categoryKeys: string[] = [];

        if (panel === 'doctor') {
            categoryKeys = ['doctor_panel', 'general'];
        } else if (panel === 'lab') {
            categoryKeys = ['lab_panel', 'general'];
        } else if (panel === 'admin') {
            categoryKeys = ['super_admin', 'general'];
        } else {
            categoryKeys = ['general'];
        }

        // Collect relevant questions
        const suggestions: { id: string; question: string }[] = [];

        categoryKeys.forEach(categoryKey => {
            const category = knowledgeBase.categories[categoryKey];
            if (category && category.faqs) {
                // Take first 3-4 questions from each relevant category
                const limit = categoryKey === 'general' ? 2 : 4;
                category.faqs.slice(0, limit).forEach(faq => {
                    suggestions.push({
                        id: faq.id,
                        question: faq.question
                    });
                });
            }
        });

        // Limit to 6 suggestions total
        const limitedSuggestions = suggestions.slice(0, 6);

        return NextResponse.json({
            suggestions: limitedSuggestions,
            panel
        });

    } catch (error: any) {
        console.error('Suggestions API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to fetch suggestions',
                details: error.message || 'Unknown error'
            },
            { status: 500 }
        );
    }
}
