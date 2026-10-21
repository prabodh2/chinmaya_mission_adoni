import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';

dotenv.config();

// ──────────────────────────────────────────────────────────────────────────────
// Cloudflare R2 Configuration
// Uses the AWS S3-compatible API exposed by Cloudflare R2.
// Required env vars:
//   R2_ACCOUNT_ID      – Your Cloudflare account ID
//   R2_ACCESS_KEY_ID   – R2 API token access key
//   R2_SECRET_ACCESS_KEY – R2 API token secret key
//   R2_BUCKET_NAME     – Name of the R2 bucket
//   R2_PUBLIC_URL      – Public base URL (e.g. https://assets.chinmayamissionadoni.org)
//                        OR the R2 public dev URL: https://<hash>.r2.dev
// ──────────────────────────────────────────────────────────────────────────────

const isR2Configured = () =>
  !!(
    process.env.R2_ACCOUNT_ID &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY &&
    process.env.R2_BUCKET_NAME &&
    process.env.R2_ACCOUNT_ID !== 'your_r2_account_id'
  );

let r2Client = null;

if (isR2Configured()) {
  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
  });
  console.log('[R2] Cloudflare R2 storage configured for production.');
} else {
  console.log('[R2] Running without R2 credentials — uploads will use local data URI fallback (Development).');
}

/**
 * Derives a clean, URL-safe object key from a folder + original filename.
 * e.g. "marathon_assets/banners" + "My Photo.png" → "marathon_assets/banners/my_photo_a3f9.png"
 *
 * @param {string} folder  - Destination folder path in the bucket (e.g. "marathon_assets/banner")
 * @param {string} originalName - Original file name from multer
 * @param {string} mimeType - MIME type used to determine extension if name lacks one
 */
const buildObjectKey = (folder, originalName = 'upload', mimeType = 'image/jpeg') => {
  const ext =
    path.extname(originalName).toLowerCase() ||
    (mimeType.includes('png') ? '.png' : mimeType.includes('gif') ? '.gif' : mimeType.includes('webp') ? '.webp' : mimeType.includes('pdf') ? '.pdf' : '.jpg');
  const base = path.basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '_')
    .substring(0, 40);
  const rand = crypto.randomBytes(4).toString('hex');
  const cleanFolder = folder.replace(/\/+$/, '');
  return `${cleanFolder}/${base}_${rand}${ext}`;
};

/**
 * Returns the public URL for a stored object key.
 * Prefers a custom domain via R2_PUBLIC_URL env var, falls back to R2 dev URL pattern.
 *
 * @param {string} key - Object key in R2
 */
const getPublicUrl = (key) => {
  const base = (process.env.R2_PUBLIC_URL || '').replace(/\/+$/, '');
  if (base) return `${base}/${key}`;
  // Fallback: use R2 public bucket URL (requires bucket to be set to Public)
  return `https://pub-${process.env.R2_ACCOUNT_ID}.r2.dev/${key}`;
};

/**
 * Uploads a file buffer to Cloudflare R2.
 * Falls back to a base64 data URI in development if R2 is not configured.
 *
 * @param {Buffer}  buffer       - File contents as Buffer
 * @param {string}  folder       - Destination folder in R2 bucket
 * @param {string}  mimeType     - MIME type of the file
 * @param {string}  originalName - Original filename (for key generation)
 * @returns {Promise<{ url: string, public_id: string }>}
 */
export const uploadToR2 = async (buffer, folder = 'chinmaya_assets', mimeType = 'image/jpeg', originalName = 'upload') => {
  if (!isR2Configured()) {
    // ── Development Fallback: base64 Data URI ─────────────────────────────────
    const base64Str = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64Str}`;
    const devKey = buildObjectKey(folder, originalName, mimeType);
    return {
      url: dataUrl,
      public_id: `dev_${devKey}`,
    };
  }

  // ── Production: Upload to R2 ─────────────────────────────────────────────
  const key = buildObjectKey(folder, originalName, mimeType);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimeType,
    // Cache-Control for long-lived media assets
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await r2Client.send(command);

  return {
    url: getPublicUrl(key),
    public_id: key, // Use the object key as the "public_id" (replaces Cloudinary public_id)
  };
};

/**
 * Alias: uploadToCloudinary → uploadToR2
 * Maintains backward-compatible API so all existing callers work without change.
 * The signature is augmented with originalName; callers that don't pass it get
 * a generated name derived from mimeType.
 */
export const uploadToCloudinary = uploadToR2;

/**
 * Deletes an object from R2 by its key (public_id).
 * Silently no-ops in development or if the key is a dev_ prefixed data URI key.
 *
 * @param {string} key - Object key in R2 (stored as publicId in MongoDB)
 */
export const deleteFromR2 = async (key) => {
  if (!isR2Configured() || !key || key.startsWith('dev_') || key.startsWith('data:')) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    await r2Client.send(command);
    console.log(`[R2] Deleted object: ${key}`);
  } catch (err) {
    // Non-fatal: log and continue
    console.error(`[R2] Failed to delete object ${key}:`, err.message);
  }
};

/**
 * Generates a short-lived (15 min) pre-signed URL for private objects.
 * Useful if the bucket is set to private and you want time-limited access.
 *
 * @param {string} key  - Object key in R2
 * @param {number} [expiresIn=900] - Expiry in seconds (default 15 min)
 */
export const getPresignedUrl = async (key, expiresIn = 900) => {
  if (!isR2Configured()) return null;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(r2Client, command, { expiresIn });
};

export { isR2Configured };
export default r2Client;
