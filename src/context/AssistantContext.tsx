'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAssistant, Message } from '@ai-sdk/react';

interface AssistantContextType {
    messages: Message[];
    status: string;
    input: string;
    submitMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
    const { messages, status, input, submitMessage, handleInputChange } = useAssistant({
        api: '/api/assistant',
    });

    return <AssistantContext.Provider value={{ messages, status, input, submitMessage, handleInputChange }}>{children}</AssistantContext.Provider>;
};

export const useAssistantContext = (): AssistantContextType => {
    const context = useContext(AssistantContext);
    if (!context) {
        throw new Error('useAssistantContext must be used within an AssistantProvider');
    }
    return context;
};
