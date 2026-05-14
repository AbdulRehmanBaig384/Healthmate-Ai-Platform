const multer=require('multer');
const cloudinary=require('cloudinary').v2;
const {CloudinaryStorage}=require('multer-storage-cloudinary');
const path=require('path');
const fs=require('fs');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage=process.env.NODE_ENV === 'production'
  ?new CloudinaryStorage({
      cloudinary:cloudinary,
      params:{
        folder: 'healthmate/reports',
        resource_type: 'auto',
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      }
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null,uploadDir);
      },
      filename:(req, file, cb) => {
        cb(null,Date.now() + '-' + file.originalname);
      }
    });
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only images and PDF files are allowed!'), false);
  }};
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 
  }
});
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success:false,
        message:'too many files. Maximum is 1 file per upload.'
      });
    }
  }
  if (error.message === 'Only images and PDF files are allowed!') {
    return res.status(400).json({
      success:false,
      message:error.message
    });}
  next(error);
};
module.exports = {upload,handleUploadError};
