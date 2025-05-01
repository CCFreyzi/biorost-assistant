import { AssistantResponse } from 'ai';
import OpenAI from 'openai';
import { GoogleSheetsService } from '@/services/google-sheets-service';
import dotenv from 'dotenv';

dotenv.config();

const sheetsService = new GoogleSheetsService();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

export const maxDuration = 30;

export async function POST(req: Request) {
    const input: {
        threadId: string | null;
        message: string;
    } = await req.json();

    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

    const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
    });

    return AssistantResponse({ threadId, messageId: createdMessage.id }, async ({ forwardStream, sendDataMessage }) => {
        const runStream = openai.beta.threads.runs.stream(threadId, {
            assistant_id:
                process.env.ASSISTANT_ID ??
                (() => {
                    throw new Error('ASSISTANT_ID is not set');
                })(),
        });

        let runResult = await forwardStream(runStream);

        while (runResult?.status === 'requires_action' && runResult.required_action?.type === 'submit_tool_outputs') {
            const tool_outputs = await Promise.all(
                runResult.required_action.submit_tool_outputs.tool_calls.map(async (toolCall: any) => {
                    const parameters = JSON.parse(toolCall.function.arguments);

                    switch (toolCall.function.name) {
                        case 'get_all_products': {
                            const products = await sheetsService.readRange();
                            console.log(products);

                            return {
                                tool_call_id: toolCall.id,
                                output: JSON.stringify(products),
                            };
                        }

                        default:
                            throw new Error(`Unknown tool call function: ${toolCall.function.name}`);
                    }
                })
            );

            runResult = await forwardStream(openai.beta.threads.runs.submitToolOutputsStream(threadId, runResult.id, { tool_outputs }));
        }
    });
}
