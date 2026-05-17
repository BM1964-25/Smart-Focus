import { create } from 'zustand';
import { requestAiSuggestion, type AiRequestContext } from '../services/aiClient';
import type { AiSuggestionResponse } from '../types/domain';

interface AiState {
  loading: boolean;
  error?: string;
  suggestion?: AiSuggestionResponse;
  requestSuggestion: (context: AiRequestContext) => Promise<void>;
  clear: () => void;
}

export const useAiStore = create<AiState>((set) => ({
  loading: false,
  async requestSuggestion(context) {
    set({ loading: true, error: undefined });
    try {
      set({ suggestion: await requestAiSuggestion(context), loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'KI-Vorschlag konnte nicht geladen werden', loading: false });
    }
  },
  clear() {
    set({ suggestion: undefined, error: undefined });
  }
}));
