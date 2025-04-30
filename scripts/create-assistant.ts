// scripts/create-assistant.ts
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

async function createAssistant() {
    const assistant = await openai.beta.assistants.create({
        model: 'gpt-4o',
        name: 'Product Assistant',
        instructions: 'Допомагай користувачам знаходити продукцію.',
        tools: [
            {
                type: 'function',
                function: {
                    name: 'get_all_products',
                    description: 'Поверни повний список продукції з Google Таблиці',
                    parameters: {
                        type: 'object',
                        properties: {},
                    },
                },
            },
        ],
    });

    console.log('✅ Assistant created:', assistant.id);
}

createAssistant().catch(console.error);
