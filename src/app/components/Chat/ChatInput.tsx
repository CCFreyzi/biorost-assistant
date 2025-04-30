'use client';

import { FiSend, FiTrash2 } from 'react-icons/fi';
import React, { useRef } from 'react';
import { useAssistantContext } from '@/context/AssistantContext';

export default function ChatInput() {
    const { input, status, handleInputChange, submitMessage } = useAssistantContext();

    const formRef = useRef<HTMLFormElement>(null);

    const clearInput = () => {
        handleInputChange({
            target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    return (
        <form ref={formRef} onSubmit={submitMessage} className="p-3 border-t border-green-200 flex gap-2 bg-white">
            <button type="button" onClick={clearInput} className="p-2 text-green-800 hover:text-green-600 disabled:opacity-50 transition-colors" disabled={!input}>
                <FiTrash2 className="text-lg" />
            </button>

            <input disabled={status !== 'awaiting_message'} value={input} onChange={handleInputChange} placeholder="Введіть запитання..." className="flex-1 p-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-[#e2fae2] text-green-900" />

            <button type="submit" disabled={status !== 'awaiting_message' || !input.trim()} className="p-2 text-green-800 hover:text-green-600 disabled:opacity-50 transition-colors">
                <FiSend className="text-lg" />
            </button>
        </form>
    );
}
