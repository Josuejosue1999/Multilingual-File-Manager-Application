const File = require('../models/File'); // Modèle File
const fs = require('fs');
const path = require('path');

// Télécharger un fichier
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Création d'une entrée pour le fichier dans MongoDB
        const newFile = new File({
            user: req.user ? req.user._id : null, // Si un utilisateur est connecté
            name: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            description: req.body.description || '', // Description optionnelle
        });

        await newFile.save();

        res.status(201).json({
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
        console.error(`[ERROR] Uploading file: ${error.message}`);
        res.status(500).json({ message: 'Error uploading file', error: error.message });
    }
};

// Obtenir tous les fichiers
const getFiles = async (req, res) => {
    try {
        const files = await File.find(); // Récupération de tous les fichiers
        res.status(200).json({ files });
    } catch (error) {
        console.error(`[ERROR] Fetching files: ${error.message}`);
        res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
};

// Supprimer un fichier
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;

        // Trouver le fichier dans la base de données
        const file = await File.findById(id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Vérifiez si le fichier existe dans le système de fichiers
        if (fs.existsSync(file.path)) {
            // Supprimer le fichier du système de fichiers
            fs.unlinkSync(file.path);
            console.log(`[INFO] File deleted from filesystem: ${file.path}`);
        } else {
            console.warn(`[WARNING] File not found in filesystem: ${file.path}`);
        }

        // Supprimer l'entrée de la base de données
        await File.findByIdAndDelete(id);

        res.status(200).json({ message: `File with ID ${id} deleted successfully` });
    } catch (error) {
        console.error(`[ERROR] Deleting file: ${error.message}`);
        res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
};

module.exports = { uploadFile, getFiles, deleteFile };
