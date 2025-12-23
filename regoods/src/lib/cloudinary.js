import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file (Buffer or Base64) to Cloudinary.
 * @param {Buffer|string} file - The file to upload.
 * @param {string} folder - The folder in Cloudinary to store the image.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file, folder = 'regoods') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        resolve(result.secure_url);
      }
    );

    // If file is a Buffer, write it to the stream
    if (Buffer.isBuffer(file)) {
      uploadStream.end(file);
    } else {
      // Assuming it's a base64 string or file path (though we usually use Buffers in Server Actions)
      cloudinary.uploader.upload(file, { folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      });
    }
  });
}

export default cloudinary;
