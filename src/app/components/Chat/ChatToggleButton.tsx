'use client';

import { FiMessageSquare } from 'react-icons/fi';

interface ChatToggleButtonProps {
    toggleChat: () => void;
}

export default function ChatToggleButton({ toggleChat }: ChatToggleButtonProps) {
    return (
        <button onClick={toggleChat} className="fixed md:relative bottom-6 right-6 flex items-center justify-center w-14 h-14 bg-green-600 rounded-full shadow-lg hover:bg-green-700 transition-colors" aria-label="Open chat" title="Open chat">
            <FiMessageSquare className="text-white text-2xl" />
        </button>
    );
}
