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
            categoryKeys = ['doctor_panel', 'common_questions', 'general'];
        } else if (panel === 'lab') {
            categoryKeys = ['lab_panel', 'common_questions', 'general'];
        } else if (panel === 'admin') {
            categoryKeys = ['super_admin', 'common_questions', 'general'];
        } else {
            categoryKeys = ['common_questions', 'general'];
        }

        // Collect relevant questions
        const suggestions: { id: string; question: string }[] = [];

        categoryKeys.forEach(categoryKey => {
            const category = knowledgeBase.categories[categoryKey];
            if (category && category.faqs) {
                // If it's common_questions, pick a few random ones
                if (categoryKey === 'common_questions') {
                    const shuffled = [...category.faqs].sort(() => 0.5 - Math.random());
                    shuffled.slice(0, 3).forEach(faq => {
                        suggestions.push({
                            id: faq.id,
                            question: faq.question
                        });
                    });
                } else {
                    // Take first 1-2 questions from other categories
                    const limit = categoryKey === 'general' ? 1 : 2;
                    category.faqs.slice(0, limit).forEach(faq => {
                        suggestions.push({
                            id: faq.id,
                            question: faq.question
                        });
                    });
                }
            }
        });

        // Shuffle all collected suggestions and limit to 5 total
        const finalSuggestions = suggestions
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        return NextResponse.json({
            suggestions: finalSuggestions,
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
