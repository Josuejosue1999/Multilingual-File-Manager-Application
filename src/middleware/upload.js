const multer = require('multer');
const path = require('path');

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Dossier pour les fichiers uploadés
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        cb(null, uniqueSuffix);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite : 10 Mo
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|pdf|docx/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedFileTypes.test(file.mimetype);

        if (extname && mimeType) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and DOCX are allowed.'));
        }
    },
});

// Gestion des erreurs spécifiques à multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: 'Multer error occurred', error: err.message });
    } else if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
};

module.exports = { upload, handleMulterError };
