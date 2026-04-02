const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBase64(base64, folder = 'floriva-shared') {
  const result = await cloudinary.uploader.upload(base64, {
    folder,
    resource_type: 'image',
    format: 'webp',
    quality: 'auto:good',
    transformation: [{ width: 1200, crop: 'limit' }],
  });
  return result.secure_url;
}

module.exports = { uploadBase64 };
