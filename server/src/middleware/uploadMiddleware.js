import multer from 'multer';

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const documentFilter = (req, file, cb) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];
  if (allowedTypes.includes(file.mimetype) || file.originalname.match(/\.(csv|xls|xlsx)$/i)) {
    cb(null, true);
  } else {
    cb(new Error('Only .csv, .xls, and .xlsx spreadsheet files are allowed'), false);
  }
};

export const uploadSingleImage = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: imageFilter,
}).single('image');

export const uploadSpreadsheet = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB max
  fileFilter: documentFilter,
}).single('file');
