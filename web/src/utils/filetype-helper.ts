/**
 * Judge GIF File type by mime type
 * @param file File object
 * @returns if passed file object is a gif image.
 */
export const isGIF = (file: File): boolean => {
  return file.type === 'image/gif';
};
