const File = require('../models/File'); // Modèle File
const fs = require('fs');
const uploadQueue = require('../queue/uploadQueue'); // Importer la file d'attente

// Télécharger un fichier
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            console.warn('[WARNING] No file received in the request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log(`[INFO] Received file: ${req.file.originalname}`);

        const newFile = new File({
            user: req.user ? req.user._id : null, // Associe à un utilisateur si disponible
            name: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            description: req.body.description || '', // Optionnel
        });

        // Sauvegarder dans MongoDB
        await newFile.save();
        console.log(`[INFO] File saved to database: ${newFile._id}`);

        // Réponse immédiate au client
        return res.status(201).json({
            message: 'File uploaded successfully',
            file: {
                id: newFile._id,
                name: newFile.name,
                path: newFile.path,
                mimeType: newFile.mimeType,
                size: newFile.size,
                description: newFile.description,
            },
        });
    } catch (error) {
        console.error(`[ERROR] Error uploading file: ${error.message}`);
        return res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};


// Obtenir tous les fichiers
const getFiles = async (req, res) => {
    try {
        const files = await File.find(); // Récupérer tous les fichiers
        console.log(`[INFO] Retrieved ${files.length} file(s) from the database`);
        return res.status(200).json({ files });
    } catch (error) {
        console.error(`[ERROR] Fetching files: ${error.message}`);
        return res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
};

// Supprimer un fichier
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        const file = await File.findById(id);
        if (!file) {
            console.warn(`[WARNING] File not found in database: ID ${id}`);
            return res.status(404).json({ message: 'File not found' });
        }

        // Supprimer le fichier du système de fichiers
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
            console.log(`[INFO] File deleted from filesystem: ${file.path}`);
        } else {
            console.warn(`[WARNING] File not found in filesystem: ${file.path}`);
        }

        // Supprimer l'entrée dans la base de données
        await File.findByIdAndDelete(id);
        console.log(`[INFO] File deleted from database: ID ${id}`);

        return res.status(200).json({ message: `File with ID ${id} deleted successfully` });
    } catch (error) {
        console.error(`[ERROR] Deleting file: ${error.message}`);
        return res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
};

// Mettre un fichier dans la file d'attente
const queueUpload = (req, res) => {
    try {
        console.log('[INFO] Queuing upload request...');
        uploadQueue.add(req.body);
        return res.status(200).json({ message: 'File upload queued successfully' });
    } catch (error) {
        console.error(`[ERROR] Queuing file upload: ${error.message}`);
        return res.status(500).json({ message: 'Error queuing file upload', error: error.message });
    }
};

module.exports = { uploadFile, getFiles, deleteFile, queueUpload };
