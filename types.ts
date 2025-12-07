export interface ImageState {
  file: File | null;
  previewUrl: string | null;
  base64: string | null;
  mimeType: string | null;
}

export interface GeneratedImage {
  url: string;
  base64: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface EditorProps {
  originalImage: ImageState;
  onReset: () => void;
}
