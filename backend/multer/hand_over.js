const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create storage directory if it doesn't exist
const uploadDir = 'public/stocks/equipement/hand_over';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename using timestamp and original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'equipment-' + uniqueSuffix + ext);
  }
});

// Filter for image files only
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 2048 * 2048, // 2MB max file size to match frontend limit
    files: 10 // maximum 10 files at once
  }
});

// Middleware for handling equipment data only (no file uploads)
const processEquipmentData = (req, res, next) => {
  // Parse JSON data if needed
  try {
    if (typeof req.body === 'string') {
      req.body = JSON.parse(req.body);
    }
    next();
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Error parsing request data: ${err.message}`
    });
  }
};

// Middleware for handling image uploads
const uploadEquipmentImages = upload.single('image');

module.exports = {
  processEquipmentData,
  uploadEquipmentImages
};