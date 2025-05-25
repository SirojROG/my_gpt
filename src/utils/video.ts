
/**
 * Video utility functions for handling video files
 */

// Check if file is a valid video
export const isValidVideo = (file: File): boolean => {
  return file.type.startsWith('video/');
};

// Check if file size is within limit
export const isFileSizeValid = (file: File, maxSizeInBytes: number): boolean => {
  return file.size <= maxSizeInBytes;
};

// Format file size to a readable string
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  else return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
};

// Create object URL for a file
export const createFileURL = (file: File): string => {
  return URL.createObjectURL(file);
};

// Clean up object URL to prevent memory leaks
export const revokeFileURL = (url: string): void => {
  URL.revokeObjectURL(url);
};
