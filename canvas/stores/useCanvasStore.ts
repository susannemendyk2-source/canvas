import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CanvasCardType, CanvasObject } from "@/types";
import { uid } from "@/lib/utils";

interface CanvasState {
  objects: CanvasObject[];
  selectedId?: string;
  addObject: (type: CanvasCardType, partial?: Partial<CanvasObject>) => void;
  updateObject: (id: string, patch: Partial<CanvasObject>) => void;
  duplicateObject: (id: string) => void;
  deleteSelected: () => void;
  selectObject: (id?: string) => void;
}

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      objects: [],
      selectedId: undefined,
      addObject: (type, partial) => {
        const id = uid("card");
        set((state) => ({
          objects: [
            ...state.objects,
            {
              id,
              type,
              title: partial?.title ?? `${type} 卡片 / ${type} card`,
              x: partial?.x ?? 180 + state.objects.length * 28,
              y: partial?.y ?? 160 + state.objects.length * 24,
              width: partial?.width ?? 320,
              height: partial?.height ?? 220,
              content: partial?.content ?? "新的创意资产已准备好继续细化。New creative asset ready for refinement.",
              meta: partial?.meta
            }
          ],
          selectedId: id
        }));
      },
      updateObject: (id, patch) =>
        set((state) => ({
          objects: state.objects.map((item) => (item.id === id ? { ...item, ...patch } : item))
        })),
      duplicateObject: (id) => {
        const source = get().objects.find((item) => item.id === id);
        if (!source) return;
        const copyId = uid("card");
        set((state) => ({
          objects: [
            ...state.objects,
            {
              ...source,
              id: copyId,
              x: source.x + 28,
              y: source.y + 28,
              title: `${source.title} 副本 / copy`
            }
          ],
          selectedId: copyId
        }));
      },
      deleteSelected: () =>
        set((state) => ({
          objects: state.objects.filter((item) => item.id !== state.selectedId),
          selectedId: undefined
        })),
      selectObject: (id) => set({ selectedId: id })
    }),
    {
      name: "polaris.canvas",
      partialize: (state) => ({ objects: state.objects })
    }
  )
);
