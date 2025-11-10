export interface FileState {
  pvzFile: File | null;
  handFile: File | null;
  setPvzFile: (file: File | null) => void;
  setHandFile: (file: File | null) => void;
  loadingPvz: boolean;
  loadingHand: boolean;
  uploadFiles: (typeFile: string) => Promise<void>;
}
