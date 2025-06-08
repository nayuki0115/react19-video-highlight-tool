interface VideoState {
  file: File | null;
  videoURL: string | null;
  transcript: Section[] | null;
  setFile: (file: File) => void;
  setVideoURL: (url: string) => void;
  setTranscript: (t: Section[]) => void;
}
