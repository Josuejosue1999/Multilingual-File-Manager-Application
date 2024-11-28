const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Vérification et création du dossier `uploads` si nécessaire
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`[INFO] Directory 'uploads' created.`);
}

// Configuration de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Dossier pour les fichiers uploadés
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        cb(null, uniqueSuffix);
    },
});

// Configuration des filtres et limites
const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limite augmentée à 50 Mo
    fileFilter: (req, file, cb) => {
        const allowedFileTypes = /jpeg|jpg|png|pdf|docx/;
        const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedFileTypes.test(file.mimetype);

        if (extname && mimeType) {
            console.log(`[INFO] Valid file type: ${file.originalname}`);
            cb(null, true);
        } else {
            console.warn(`[WARNING] Invalid file type: ${file.originalname}`);
            cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and DOCX are allowed.'));
        }
    },
});

// Middleware de gestion des erreurs spécifiques à multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Erreurs spécifiques à multer
        console.error(`[ERROR] Multer error: ${err.message}`);
        return res.status(400).json({ message: 'Multer error occurred', error: err.message });
    } else if (err) {
        // Autres erreurs liées au téléchargement
        console.error(`[ERROR] Upload error: ${err.message}`);
        return res.status(400).json({ message: err.message });
    }
    next();
};

// Vérification des fichiers présents dans le dossier `uploads`
const verifyUploadedFiles = () => {
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            console.error(`[ERROR] Unable to read uploads directory: ${err.message}`);
            return;
        }
        console.log(`[INFO] Found ${files.length} file(s) in uploads directory.`);
        files.forEach(file => console.log(`[INFO] Found file: ${file}`));
    });
};

// Vérifiez les fichiers au démarrage
verifyUploadedFiles();

module.exports = { upload, handleMulterError };
