'use client';

import { useState } from 'react';
import ChatHeader from './ChatHeader';
import ChatMessages from './ChatMessages';
import ChatInput from './ChatInput';
import ChatToggleButton from './ChatToggleButton';

export default function ChatWindow() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleChat = () => setIsOpen((prev) => !prev);

    return (
        <div className="fixed bottom-0 left-0 right-0 px-2 pb-2 md:bottom-6 md:right-6 md:left-auto md:px-0 z-50">
            {!isOpen ? (
                <ChatToggleButton toggleChat={toggleChat} />
            ) : (
                <div className="w-full mx-auto max-w-[calc(100%-16px)] md:max-w-none md:w-110 h-[550px] bg-white shadow-xl flex flex-col overflow-hidden rounded-md border border-green-100">
                    <ChatHeader onClose={toggleChat} />
                    <ChatMessages />
                    <ChatInput />
                </div>
            )}
        </div>
    );
}
