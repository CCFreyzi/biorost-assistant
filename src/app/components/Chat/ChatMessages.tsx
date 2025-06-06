'use client';

import { MathJax, MathJaxContext } from 'better-react-mathjax';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useFaq } from '@/context/FaqContext';
import { useEffect, useRef } from 'react';
import { useAssistantContext } from '@/context/AssistantContext';
import { FaSpinner } from 'react-icons/fa';

const config = {
    loader: { load: ['[tex]/text'] },
    tex: {
        packages: ['base', 'text'],
    },
};

const faqs = ['Скільки потрібно Біорост «СТАРТ» для 15 гектарів озимої пшениці навесні?', 'Скільки літрів Біорост «СТАРТ» потрібно для обробки 10 гектарів ріпаку?', 'Чим корисні використання продуктів Біорост  при обробці по листу навесні?', 'Скільки коштує обробка 10 соток препаратом Біорост ІМУНІТЕТ КВІТИ?'];

export default function ChatMessages() {
    const { setFaqClicked } = useFaq();
    const { messages, status, handleInputChange, formRef } = useAssistantContext();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFAQClick = (question: string) => {
        handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
        setFaqClicked(true);

        setTimeout(() => {
            formRef.current?.requestSubmit();
        }, 0);
    };

    return (
        <MathJaxContext version={3} config={config}>
            <div className="flex-1 p-4 overflow-y-auto bg-[#E7F5E9]">
                {messages.length === 0 ? (
                    <div className="space-y-2">
                        <div className="text-center text-green-900 mb-4">Вітаю! Ось популярні запитання:</div>
                        {faqs.map((faq, index) => (
                            <button key={index} onClick={() => handleFAQClick(faq)} className="w-full text-left p-3 bg-white hover:bg-green-100 rounded-lg transition-colors text-sm text-green-900 border border-green-300">
                                {faq}
                            </button>
                        ))}
                    </div>
                ) : (
                    <>
                        {messages.map((m) => {
                            const isMath = /\\\(|\\\[|\\begin|\\text|\\frac|=|times/.test(m.content);

                            return (
                                <div key={m.id} className={`chat-message mb-3 p-3 rounded-lg ${m.role === 'user' ? 'bg-green-600 text-white ml-auto' : 'bg-white text-green-900 mr-auto border border-green-300'}`}>
                                    <strong className="block text-sm mb-1">{m.role === 'user' ? 'Ви' : 'Асистент'}</strong>

                                    {isMath ? (
                                        <MathJax dynamic inline={false}>
                                            {m.content}
                                        </MathJax>
                                    ) : (
                                        <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                                            {m.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                            );
                        })}

                        {status === 'in_progress' && (
                            <div className="text-center py-2 flex flex-col gap-y-2 items-center justify-center">
                                {/* <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div> */}
                                <FaSpinner className="inline-block animate-spin text-green-600 text-4xl" />

                            </div>
                        )}
                    </>
                )}
                <div ref={messagesEndRef} />
            </div>
        </MathJaxContext>
    );
}
