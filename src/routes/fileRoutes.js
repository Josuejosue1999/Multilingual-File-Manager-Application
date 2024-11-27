const express = require('express');
const router = express.Router();
const { uploadFile, getFiles, deleteFile } = require('../controllers/fileController');
const { upload, handleMulterError } = require('../middleware/upload'); // Middleware pour gérer les fichiers

// Route POST pour télécharger un fichier
router.post(
    '/upload',
    (req, res, next) => {
        console.log('[INFO] POST /upload called');
        next();
    },
    upload.single('file'),
    handleMulterError, // Gestion des erreurs spécifiques à Multer
    (req, res, next) => {
        if (!req.file) {
            console.error('[ERROR] No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }
        next();
    },
    uploadFile
);

// Route GET pour obtenir tous les fichiers
router.get(
    '/',
    (req, res, next) => {
        console.log('[INFO] GET /api/files called');
        next();
    },
    getFiles
);

// Route DELETE pour supprimer un fichier spécifique
router.delete(
    '/:id',
    (req, res, next) => {
        console.log(`[INFO] DELETE /api/files/${req.params.id} called`);
        next();
    },
    deleteFile
);

module.exports = router;
