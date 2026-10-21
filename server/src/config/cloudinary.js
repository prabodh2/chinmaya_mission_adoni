/**
 * DEPRECATED — Storage has been migrated to Cloudflare R2.
 * This file is kept as a shim so any lingering imports of '../config/cloudinary.js'
 * continue to work without code changes.  All symbols are re-exported from r2.js.
 */
export { uploadToCloudinary, uploadToR2, deleteFromR2, getPresignedUrl, isR2Configured } from './r2.js';
