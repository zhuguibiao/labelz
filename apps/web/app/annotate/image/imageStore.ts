import { create } from "zustand";

export const defaultLabels = [
  "Object",
  "Person",
  "Vehicle",
  "Building",
  "Animal",
  "Text",
  "Logo",
];

interface ImageAnnotationState {
  drawType: any;
  drawInstance: any;
  setDrwaInstance: (canvas: any) => void;
  setDrawType: (canvas: any) => void;
  images: any[];
  currentIndex: any;
  labels: string[];
  annotations: any[];
  showAnnotationList: boolean;
  showImageList: boolean;
  setImages: (images: any[]) => void;
  setCurrentIndex: (index: any) => void;
  setLabels: (labels: string[]) => void;
}

export const useImageAnnotationStore = create<ImageAnnotationState>(
  (set, get) => ({
    images: [],
    drawType: {},
    setDrawType: (drawType: any) => {
      set({ drawType });
    },
    drawInstance: {},
    setDrwaInstance: (drawInstance: any) => {
      set({ drawInstance });
    },
    currentIndex: -1,
    labels: defaultLabels,
    annotations: [],
    showAnnotationList: true,
    showImageList: true,
    setImages: (images) => {
      set({ images });
    },
    setCurrentIndex: (index: any) => {
      set({ currentIndex: index });
    },
    setLabels: (labels: string[]) => set({ labels }),
  })
);
