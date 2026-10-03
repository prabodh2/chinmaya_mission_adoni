import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'demo_cloud' &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('[Cloudinary] Configured for production cloud storage.');
} else {
  console.log('[Cloudinary] Running with fallback image buffer storage mode (Development).');
}

/**
 * Uploads file buffer to Cloudinary or returns high-res Data URI
 * @param {Buffer} buffer - File buffer
 * @param {string} folder - Target folder name
 * @param {string} mimeType - MIME type (e.g. image/png)
 * @returns {Promise<{url: string, public_id: string}>}
 */
export const uploadToCloudinary = async (buffer, folder = 'marathon_assets', mimeType = 'image/jpeg') => {
  if (isCloudinaryConfigured()) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          format: 'webp',
          transformation: [{ quality: 'auto', fetch_format: 'webp' }],
        },
        (error, result) => {
          if (error) return reject(error);
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      );
      uploadStream.end(buffer);
    });
  } else {
    // Fallback Data URL for seamless development without requiring immediate external keys
    const base64Str = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Str}`;
    return {
      url: dataUrl,
      public_id: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    };
  }
};
