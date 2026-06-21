"use client";

import { create } from "zustand";

export type ApiProvider = "deepseek" | "runninghub" | "volcano";

export interface ProviderSettings {
  provider: ApiProvider;
  baseUrl: string;
  apiKey: string;
  model: string;
}

interface SettingsState {
  open: boolean;
  activeProvider: ApiProvider;
  providers: Record<ApiProvider, ProviderSettings>;
  hydrated: boolean;
  setOpen: (open: boolean) => void;
  setActiveProvider: (provider: ApiProvider) => void;
  updateProvider: (provider: ApiProvider, patch: Partial<ProviderSettings>) => void;
  hydrate: () => void;
  save: () => void;
  getActive: () => ProviderSettings;
}

const defaults: Record<ApiProvider, ProviderSettings> = {
  deepseek: {
    provider: "deepseek",
    baseUrl: "https://api.deepseek.com",
    apiKey: "",
    model: "deepseek-chat"
  },
  runninghub: {
    provider: "runninghub",
    baseUrl: "https://www.runninghub.cn/openapi/v2",
    apiKey: "",
    model: "nano-banana-pro"
  },
  volcano: {
    provider: "volcano",
    baseUrl: "https://ark.cn-beijing.volces.com/api/v3",
    apiKey: "",
    model: "doubao-seed-1-6"
  }
};

const storageKey = "polaris.api.settings";

export const useSettingsStore = create<SettingsState>((set, get) => ({
  open: false,
  activeProvider: "deepseek",
  providers: defaults,
  hydrated: false,
  setOpen: (open) => set({ open }),
  setActiveProvider: (activeProvider) => set({ activeProvider }),
  updateProvider: (provider, patch) =>
    set((state) => ({
      providers: {
        ...state.providers,
        [provider]: { ...state.providers[provider], ...patch, provider }
      }
    })),
  hydrate: () => {
    if (typeof window === "undefined" || get().hydrated) return;
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      set({ hydrated: true });
      return;
    }
    try {
      const parsed = JSON.parse(raw) as Partial<SettingsState>;
      set({
        activeProvider: parsed.activeProvider ?? "deepseek",
        providers: { ...defaults, ...(parsed.providers ?? {}) },
        hydrated: true
      });
    } catch {
      set({ hydrated: true });
    }
  },
  save: () => {
    if (typeof window === "undefined") return;
    const { activeProvider, providers } = get();
    window.localStorage.setItem(storageKey, JSON.stringify({ activeProvider, providers }));
  },
  getActive: () => get().providers[get().activeProvider]
}));
