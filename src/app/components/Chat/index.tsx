'use client';

import { MathJaxContext } from 'better-react-mathjax';
import ChatWindow from './ChatWindow';
import { FaqProvider } from '@/context/FaqContext';
import { AssistantProvider } from '@/context/AssistantContext';

export default function Chat() {
    return (
        <MathJaxContext>
            <FaqProvider>
                <AssistantProvider>
                    <ChatWindow />
                </AssistantProvider>
            </FaqProvider>
        </MathJaxContext>
    );
}
