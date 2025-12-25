
/**
 * Optimizes a Cloudinary URL by injecting transformation parameters.
 * @param {string} url - The original Cloudinary URL.
 * @param {string} transformations - Transformation string (e.g., 'q_auto,f_auto,w_800').
 * @returns {string} - The optimized URL.
 */
export function optimizeCloudinaryUrl(url, transformations = 'q_auto,f_auto') {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Cloudinary URL structure: .../upload/[version]/...
  // We want to insert transformations after /upload/
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  return `${parts[0]}/upload/${transformations}/${parts[1]}`;
}
