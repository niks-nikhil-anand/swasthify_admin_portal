
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';

// Simple .env parser since we can't depend on dotenv
function loadEnv() {
    try {
        const envLocal = path.join(process.cwd(), '.env.local');
        const env = path.join(process.cwd(), '.env');

        let envContent = '';
        if (fs.existsSync(envLocal)) {
            envContent = fs.readFileSync(envLocal, 'utf-8');
        } else if (fs.existsSync(env)) {
            envContent = fs.readFileSync(env, 'utf-8');
        }

        if (envContent) {
            envContent.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
                }
            });
        }
    } catch (e) {
        console.warn('Could not load .env', e);
    }
}

loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
    console.error('GEMINI_API_KEY not found in .env or .env.local');
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "embedding-001" });

async function generate() {
    console.log('Generating embeddings...');
    const kbPath = path.join(process.cwd(), 'public', 'chatbot-knowledge.json');
    const outPath = path.join(process.cwd(), 'public', 'chatbot-embeddings.json');

    if (!fs.existsSync(kbPath)) {
        console.error('Knowledge base not found at', kbPath);
        process.exit(1);
    }

    const kb = JSON.parse(fs.readFileSync(kbPath, 'utf-8'));
    const documents: any[] = [];

    // Flatten FAQs
    Object.values(kb.categories).forEach((cat: any) => {
        cat.faqs.forEach((faq: any) => {
            documents.push({
                id: faq.id,
                content: `Question: ${faq.question}\nAnswer: ${faq.answer}\nKeywords: ${faq.keywords.join(', ')}`,
                original: faq,
                category: cat.name
            });
        });
    });

    const embeddedDocs = [];
    for (const doc of documents) {
        console.log(`Embedding ${doc.id}...`);
        try {
            const result = await model.embedContent(doc.content);
            const embedding = result.embedding;
            embeddedDocs.push({
                ...doc,
                embedding: embedding.values
            });
            // Rate limit handling (simple delay)
            await new Promise(r => setTimeout(r, 200));
        } catch (e) {
            console.error(`Error embedding ${doc.id}:`, e);
        }
    }

    fs.writeFileSync(outPath, JSON.stringify(embeddedDocs, null, 2));
    console.log(`Saved ${embeddedDocs.length} embeddings to ${outPath}`);
}

generate().catch(console.error);
