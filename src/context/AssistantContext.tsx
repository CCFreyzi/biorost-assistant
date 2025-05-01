'use client';

import { createContext, useContext, ReactNode, useState, useEffect, useRef, RefObject } from 'react';
import { useAssistant, Message } from '@ai-sdk/react';

interface AssistantContextType {
    messages: Message[];
    status: string;
    input: string;
    submitMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    resetChat: () => void;
    formRef: RefObject<HTMLFormElement | null>;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

export const AssistantProvider = ({ children }: { children: ReactNode }) => {
    const [threadId, setThreadId] = useState<string | undefined>(undefined);
    const formRef = useRef<HTMLFormElement>(null);

    const assistant = useAssistant({ api: '/api/assistant', threadId });

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        setMessages(assistant.messages);
    }, [assistant.messages]);

    useEffect(() => {
        setInput(assistant.input);
    }, [assistant.input]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        assistant.handleInputChange(e);
        setInput(e.target.value);
    };

    const resetChat = () => {
        setMessages([]);
        setInput('');
        setThreadId(undefined);
        console.log('Default satae chat');
    };

    return (
        <AssistantContext.Provider
            value={{
                messages,
                status: assistant.status,
                input,
                submitMessage: assistant.submitMessage,
                handleInputChange,
                resetChat,
                formRef,
            }}
        >
            {children}
        </AssistantContext.Provider>
    );
};

export const useAssistantContext = (): AssistantContextType => {
    const context = useContext(AssistantContext);
    if (!context) {
        throw new Error('useAssistantContext must be used within an AssistantProvider');
    }
    return context;
};
