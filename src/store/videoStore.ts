import { create } from 'zustand';

export const useVideoStore = create<VideoState>((set) => ({
  file: null,
  videoURL: null,
  transcript: null,

  setFile: (file) => set({ file }),
  setVideoURL: (videoURL) => set({ videoURL }),
  setTranscript: (transcript) => set({ transcript }),
}));