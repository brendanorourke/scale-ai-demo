
import { ImageData } from '@/context/WizardContext';

export interface ImageUploaderProps {
  onImageSelect: (data: ImageData) => void;
  selectedImage: ImageData | null;
  onRemoveImage: () => void;
}

export interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
}

export interface UrlInputProps {
  onImageFromUrl: (url: string) => void;
}

export interface ImagePreviewProps {
  image: ImageData;
  onRemove: () => void;
}
