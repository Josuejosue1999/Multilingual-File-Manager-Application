const express = require('express');
const router = express.Router();

// Import the controller at the top
const { uploadFile, getFiles, deleteFile, queueUpload } = require('../controllers/fileController');
const { upload, handleMulterError } = require('../middleware/upload'); // Middleware for file handling

// POST route for file upload
router.post(
    '/upload',
    (req, res, next) => {
        console.log('[INFO] POST /upload called');
        next();
    },
    upload.single('file'),
    handleMulterError, // Handle specific Multer errors
    (req, res, next) => {
        if (!req.file) {
            console.error('[ERROR] No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        next();
    },
    uploadFile // Call the controller method
);

// GET route for fetching all files
router.get(
    '/',
    (req, res, next) => {
        console.log('[INFO] GET /api/files called');
        next();
    },
    getFiles // Call the controller method to fetch files
);

// DELETE route for deleting a specific file
router.delete(
    '/:id',
    (req, res, next) => {
        console.log(`[INFO] DELETE /api/files/${req.params.id} called`);
        next();
    },
    deleteFile // Call the controller method to delete file
);

// POST route for file queueing (optional feature)
router.post('/queue', queueUpload); // Ensure this route is defined in your controller

module.exports = router;
