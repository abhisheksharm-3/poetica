import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEYS } from '@/constants/config';
import { SavedPoem } from '@/utils/types';

interface PoemStore {
  // State
  poems: SavedPoem[];
  favorites: string[];
  drafts: Partial<SavedPoem>[];
  
  // Actions
  addPoem: (poem: Omit<SavedPoem, 'id' | 'createdAt'>) => void;
  updatePoem: (id: string, poem: Partial<SavedPoem>) => void;
  deletePoem: (id: string) => void;
  getPoem: (id: string) => SavedPoem | undefined;
  
  // Favorites
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  getFavorites: () => SavedPoem[];
  
  // Drafts
  saveDraft: (draft: Partial<SavedPoem>) => void;
  deleteDraft: (index: number) => void;
  clearDrafts: () => void;
  
  // Utilities
  clearAll: () => void;
  getRecentPoems: (limit?: number) => SavedPoem[];
  searchPoems: (query: string) => SavedPoem[];
  getPoemsByStyle: (style: string) => SavedPoem[];
}

const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const usePoemStore = create<PoemStore>()(
  persist(
    (set, get) => ({
      poems: [],
      favorites: [],
      drafts: [],

      addPoem: (poem) => {
        const newPoem: SavedPoem = {
          ...poem,
          id: generateId(),
          createdAt: new Date().toISOString(),
        };
        
        set((state) => ({
          poems: [newPoem, ...state.poems],
        }));
      },

      updatePoem: (id, updates) => {
        set((state) => ({
          poems: state.poems.map((poem) =>
            poem.id === id ? { ...poem, ...updates } : poem
          ),
        }));
      },

      deletePoem: (id) => {
        set((state) => ({
          poems: state.poems.filter((poem) => poem.id !== id),
          favorites: state.favorites.filter((favId) => favId !== id),
        }));
      },

      getPoem: (id) => {
        return get().poems.find((poem) => poem.id === id);
      },

      toggleFavorite: (id) => {
        set((state) => {
          const isFavorited = state.favorites.includes(id);
          return {
            favorites: isFavorited
              ? state.favorites.filter((favId) => favId !== id)
              : [...state.favorites, id],
          };
        });
      },

      isFavorite: (id) => {
        return get().favorites.includes(id);
      },

      getFavorites: () => {
        const { poems, favorites } = get();
        return poems.filter((poem) => favorites.includes(poem.id));
      },

      saveDraft: (draft) => {
        set((state) => ({
          drafts: [draft, ...state.drafts.slice(0, 4)], // Keep only last 5 drafts
        }));
      },

      deleteDraft: (index) => {
        set((state) => ({
          drafts: state.drafts.filter((_, i) => i !== index),
        }));
      },

      clearDrafts: () => {
        set({ drafts: [] });
      },

      clearAll: () => {
        set({ poems: [], favorites: [], drafts: [] });
      },

      getRecentPoems: (limit = 5) => {
        return get().poems.slice(0, limit);
      },

      searchPoems: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().poems.filter(
          (poem) =>
            poem.content.toLowerCase().includes(lowerQuery) ||
            poem.style.toLowerCase().includes(lowerQuery) ||
            poem.emotionalTone.toLowerCase().includes(lowerQuery)
        );
      },

      getPoemsByStyle: (style) => {
        return get().poems.filter((poem) => poem.style === style);
      },
    }),
    {
      name: STORAGE_KEYS.poems,
      // Separate storage for different data types
      partialize: (state) => ({
        poems: state.poems,
        favorites: state.favorites,
        drafts: state.drafts,
      }),
    }
  )
);

// Selectors for better performance
export const usePoemSelectors = {
  usePoems: () => usePoemStore((state) => state.poems),
  useFavorites: () => usePoemStore((state) => state.getFavorites()),
  useDrafts: () => usePoemStore((state) => state.drafts),
  useRecentPoems: (limit?: number) => usePoemStore((state) => state.getRecentPoems(limit)),
};
