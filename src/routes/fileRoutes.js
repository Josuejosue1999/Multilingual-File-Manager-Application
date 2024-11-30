const express = require('express');
const router = express.Router();

// Import controller methods
const {
    uploadFile,
    getFiles,
    deleteFile,
    queueUpload,
    getQueueStatus,
} = require('../controllers/fileController');
const { upload, handleMulterError } = require('../middleware/upload'); // Middleware for file handling

// POST route for file upload
router.post(
    '/upload',
    upload.single('file'), // Middleware to handle file uploads
    handleMulterError, // Middleware to handle Multer-specific errors
    uploadFile // Controller method to handle file upload
);

// GET route for fetching all files
router.get(
    '/',
    getFiles // Controller method to fetch files
);

// DELETE route for deleting a specific file
router.delete(
    '/:id',
    deleteFile // Controller method to delete file
);

// POST route for queuing a file for processing
router.post(
    '/queue',
    (req, res) => {
        console.log('[INFO] POST /api/files/queue called');
        queueUpload(req, res); // Ensure the controller method is correctly invoked
    }
);

// GET route for retrieving queue status
router.get(
    '/queue/status',
    getQueueStatus // Controller method to fetch queue status
);

module.exports = router;
