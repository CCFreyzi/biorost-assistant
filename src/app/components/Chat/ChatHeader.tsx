'use client';

import { FiRefreshCw, FiX } from 'react-icons/fi';
import { useFaq } from '@/context/FaqContext';

interface ChatHeaderProps {
    onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
    const { setFaqClicked } = useFaq();

    const onRestart = () => {
        setFaqClicked(false);
        window.location.reload();
    };

    return (
        <div className="bg-green-700 text-white p-3 flex justify-between items-center">
            <h2 className="font-semibold">Біорост асистент</h2>

            <div className="flex gap-x-4">
                <button onClick={onRestart} className="text-white hover:text-yellow-300 transition-colors">
                    <FiRefreshCw className="text-xl cursor-pointer" />
                </button>
                <button onClick={onClose} className="text-white hover:text-yellow-300 transition-colors">
                    <FiX className="text-xl cursor-pointer" />
                </button>
            </div>
        </div>
    );
}
