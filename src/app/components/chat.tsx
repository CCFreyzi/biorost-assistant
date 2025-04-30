'use client';

import { Message, useAssistant } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';
import { FiMessageSquare, FiX, FiSend, FiTrash2 } from 'react-icons/fi';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

export default function Chat() {
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [faqClicked, setFaqClicked] = useState(false);

    const { status, messages, input, submitMessage, handleInputChange, setThreadId } = useAssistant({
        api: '/api/assistant',
    });

    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const toggleChat = () => setIsOpen(!isOpen);

    const onRestart = () => {
        setThreadId(undefined);
    };

    const faqs = ['Які типи добрив у вас є?', 'Які продукти використовуються при листовій обробці навесні?', 'Які препарати застосовуються у фазу цвітіння ріпаку?', 'Як підготувати посіви до морозів?'];

    const cleanMessageText = (text: string) => {
        return text.replace(/【.*?】/g, '').replace(/\*\*/g, '');
    };

    const handleFAQClick = (question: string) => {
        setFaqClicked(true);
        handleInputChange({
            target: { value: question },
            currentTarget: { value: question },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    useEffect(() => {
        if (faqClicked && input && formRef.current) {
            const formEvent = new Event('submit', { bubbles: true }) as unknown as React.FormEvent<HTMLFormElement>;
            Object.defineProperty(formEvent, 'preventDefault', { value: () => {} });
            Object.defineProperty(formEvent, 'currentTarget', { value: formRef.current });

            submitMessage(formEvent);
            setFaqClicked(false);
        }
    }, [input, faqClicked, submitMessage]);

    return (
        <MathJaxContext
            config={{
                tex: {
                    inlineMath: [['\\(', '\\)']],
                },
            }}
        >
            <div className="fixed bottom-0 left-0 right-0 px-2 pb-2 md:bottom-6 md:right-6 md:left-auto md:px-0 z-50">
                {!isOpen && (
                    <button onClick={toggleChat} className="fixed md:relative bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors">
                        <FiMessageSquare className="text-white text-2xl" />
                    </button>
                )}

                {isOpen && (
                    <div className="w-full mx-auto max-w-[calc(100%-16px)] md:max-w-none md:w-110 h-[550px] bg-white shadow-xl flex flex-col overflow-hidden rounded-md border border-green-100">
                        <div className="bg-green-700 text-white p-3 flex justify-between items-center">
                            <h2 className="font-semibold">Біорост асистент</h2>

                            <div className="flex gap-x-4">
                                <button onClick={onRestart} className="text-white hover:text-yellow-300 transition-colors">
                                    <FiTrash2 className="text-xl cursor-pointer" />
                                </button>
                                <button onClick={toggleChat} className="text-white hover:text-yellow-300 transition-colors">
                                    <FiX className="text-xl cursor-pointer" />
                                </button>
                            </div>
                        </div>

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
                                    {messages.map((m: Message) => (
                                        <div key={m.id} className={`mb-3 p-3 rounded-lg ${m.role === 'user' ? 'bg-green-600 text-white ml-auto' : 'bg-white text-green-900 mr-auto border border-green-300'}`}>
                                            <strong className="block text-sm mb-1">{m.role === 'user' ? 'Ви' : 'Асистент'}</strong>
                                            <MathJax>{cleanMessageText(m.content)}</MathJax>
                                        </div>
                                    ))}
                                    {status === 'in_progress' && (
                                        <div className="text-center py-2">
                                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form ref={formRef} onSubmit={submitMessage} className="p-3 border-t border-green-200 flex gap-2 bg-white">
                            <button
                                type="button"
                                onClick={() => {
                                    handleInputChange({
                                        target: { value: '' },
                                    } as React.ChangeEvent<HTMLInputElement>);
                                }}
                                className="p-2 text-green-800 hover:text-green-600 disabled:opacity-50 transition-colors"
                                disabled={!input}
                            >
                                <FiTrash2 className="text-lg" />
                            </button>

                            <input disabled={status !== 'awaiting_message'} value={input} onChange={handleInputChange} placeholder="Введіть запитання..." className="flex-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-[#e2fae2] text-green-900" />

                            <button type="submit" disabled={status !== 'awaiting_message' || !input.trim()} className="p-2 text-green-800 hover:text-green-600 disabled:opacity-50 transition-colors">
                                <FiSend className="text-lg" />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </MathJaxContext>
    );
}
