import multer from 'multer'

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const uploadMedicalRecords = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
export const uploadPastMedicalRecords = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })