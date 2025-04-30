import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

async function updateAssistant() {
    const updated = await openai.beta.assistants.update(process.env.ASSISTANT_ID!, {
        instructions: 'Допомагай користувачам знаходити продукцію і фільтрувати її.',
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
            {
                type: 'function',
                function: {
                    name: 'filter_products',
                    description: 'Фільтруй продукцію за назвою, нормою або способом внесення.',
                    parameters: {
                        type: 'object',
                        properties: {
                            keyword: { type: 'string' },
                        },
                        required: ['keyword'],
                    },
                },
            },
        ],
    });

    console.log('✅ Assistant updated:', updated.id);
}

updateAssistant();
