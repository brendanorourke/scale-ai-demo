
/**
 * Formats file size in bytes to a human-readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Processes a file into an ImageData object
 */
export const processFile = (
  file: File, 
  callback: (previewUrl: string, file: File) => void
): void => {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = () => {
    const previewUrl = reader.result as string;
    callback(previewUrl, file);
  };
  reader.readAsDataURL(file);
};
