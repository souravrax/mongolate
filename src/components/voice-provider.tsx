import { createContext, useContext, useEffect, type ReactNode } from "react";
import { useVoiceStore } from "@/store/voice-store";

interface VoiceContextValue {
    isLoading: boolean;
    error: string | null;
}

const VoiceContext = createContext<VoiceContextValue>({
    isLoading: false,
    error: null,
});

export function VoiceProvider({ children }: { children: ReactNode }) {
    const { fetchVoices, isLoading, error } = useVoiceStore();

    useEffect(() => {
        fetchVoices();
    }, [fetchVoices]);

    return (
        <VoiceContext.Provider value={{ isLoading, error }}>
            {children}
        </VoiceContext.Provider>
    );
}

export function useVoiceContext() {
    return useContext(VoiceContext);
}
