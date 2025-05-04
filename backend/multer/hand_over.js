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
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 10 // maximum 10 files at once
  }
});

// Process uploaded files and add them to the request body
const uploadEquipmentImages = (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ 
        success: false, 
        message: `Upload error: ${err.message}` 
      });
    } else if (err) {
      return res.status(400).json({ 
        success: false, 
        message: err.message 
      });
    }
    
    // Add image paths to the request body
    if (req.files && req.files.length > 0) {
      req.body.images = req.files.map(file => file.path);
    }
    
    next();
  });
};

module.exports = {
  uploadEquipmentImages
};