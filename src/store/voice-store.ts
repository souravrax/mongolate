import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FALLBACK_VOICES, getDefaultVoice, type Voice } from "@/lib/languages";

interface VoiceData {
    default: string;
    voices: Voice[];
}

interface VoiceStoreState {
    // Fetched from backend (merged with hardcoded fallback)
    voices: Record<string, VoiceData>;
    // Per-language selected voice preference (lang_id -> voice_name)
    voiceMap: Record<string, string>;
    // Loading state
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchVoices: () => Promise<void>;
    getVoiceForLanguage: (langId: string) => string;
    setVoiceForLanguage: (langId: string, voiceName: string) => void;
    reset: () => void;
}

export const useVoiceStore = create<VoiceStoreState>()(
    persist(
        (set, get) => ({
            voices: FALLBACK_VOICES,
            voiceMap: {},
            isLoading: false,
            error: null,

            fetchVoices: async () => {
                const baseUrl = import.meta.env.VITE_API_BASE_URL;
                if (!baseUrl) return;

                set({ isLoading: true, error: null });

                try {
                    const response = await fetch(`${baseUrl}/voices`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch voices: ${response.status}`);
                    }

                    const data: Record<string, VoiceData> = await response.json();

                    // Merge with fallback — backend wins
                    set({
                        voices: { ...FALLBACK_VOICES, ...data },
                        isLoading: false,
                    });
                } catch (err) {
                    console.error("[VoiceStore] fetchVoices error:", err);
                    set({
                        isLoading: false,
                        error: err instanceof Error ? err.message : "Unknown error",
                    });
                }
            },

            getVoiceForLanguage: (langId: string) => {
                const { voiceMap, voices } = get();
                const userVoice = voiceMap[langId];
                if (userVoice) return userVoice;
                return voices[langId]?.default || getDefaultVoice(langId);
            },

            setVoiceForLanguage: (langId: string, voiceName: string) => {
                set((state) => ({
                    voiceMap: { ...state.voiceMap, [langId]: voiceName },
                }));
            },

            reset: () => set({ voiceMap: {} }),
        }),
        {
            name: "mongolate-voice-preferences",
            partialize: (state) => ({ voiceMap: state.voiceMap }),
        }
    )
);
