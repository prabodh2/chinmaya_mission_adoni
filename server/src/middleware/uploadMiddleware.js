import multer from 'multer';

// All uploads stay in memory; Cloudflare R2 handles persistence
const storage = multer.memoryStorage();

// ── Accepted MIME types ───────────────────────────────────────────────────────
const IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
];

const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];

const DOCUMENT_TYPES = [
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/pdf',
];

const imageFilter = (req, file, cb) => {
  if (IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image files are allowed. Received: ${file.mimetype}`), false);
  }
};

const imageOrVideoFilter = (req, file, cb) => {
  if ([...IMAGE_TYPES, ...VIDEO_TYPES].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Only image or video files are allowed. Received: ${file.mimetype}`), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowed = DOCUMENT_TYPES.includes(file.mimetype) || file.originalname.match(/\.(csv|xls|xlsx|pdf)$/i);
  if (allowed) {
    cb(null, true);
  } else {
    cb(new Error('Only .csv, .xls, .xlsx, and .pdf files are allowed'), false);
  }
};

const anyFileFilter = (req, file, cb) => cb(null, true);

// ── Exported middleware ───────────────────────────────────────────────────────

/** Single image upload (up to 20 MB) — used by media, activities, banners, CMS */
export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: imageFilter,
}).single('image');

/** Single image OR video upload (up to 100 MB) — used by homepage hero / CMS video */
export const uploadSingleMedia = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: imageOrVideoFilter,
}).single('file');

/** Spreadsheet / PDF upload (up to 15 MB) — used by bulk registration import */
export const uploadSpreadsheet = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
  fileFilter: documentFilter,
}).single('file');

/** Generic single-file upload with no type restriction (up to 100 MB) */
export const uploadAnyFile = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
  fileFilter: anyFileFilter,
}).single('file');
