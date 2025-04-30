'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FaqContextType {
    faqClicked: boolean;
    setFaqClicked: (value: boolean) => void;
}

const FaqContext = createContext<FaqContextType | undefined>(undefined);

export const FaqProvider = ({ children }: { children: ReactNode }) => {
    const [faqClicked, setFaqClicked] = useState(false);

    return <FaqContext.Provider value={{ faqClicked, setFaqClicked }}>{children}</FaqContext.Provider>;
};

export const useFaq = (): FaqContextType => {
    const context = useContext(FaqContext);
    if (context === undefined) {
        throw new Error('useFaq must be used within a FaqProvider');
    }
    return context;
};
