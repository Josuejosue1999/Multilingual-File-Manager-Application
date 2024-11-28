const File = require('../models/File'); // Modèle File
const fs = require('fs');
const uploadQueue = require('../queue/queue'); // Import your uploadQueue


const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log(uploadQueue);  // Check if queue has the 'add' method

        // Add the file upload task to the queue
        await uploadQueue.add({
            file: req.file,
            description: req.body.description || ''
        });

        // Save the file information to the database
        const newFile = new File({
            user: req.user ? req.user._id : null,  // If a user is logged in
            name: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            description: req.body.description || '',
        });

        await newFile.save();

        res.status(201).json({
            message: 'File uploaded and processing queued successfully',
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
const queueUpload = (req, res) => {
    // Your logic to queue the file upload, for example:
    console.log("Queuing upload...");
    res.status(200).json({ message: 'File upload queued successfully' });
};

const processFile = async (filePath, description) => {
    try {
      // Implement your file processing logic here
      console.log(`Processing file at ${filePath} with description: ${description}`);
      // Example: You could move it to a cloud storage or perform additional checks
    } catch (error) {
      console.error('Error during file processing:', error);
      throw error;
    }
  };
  
module.exports = { uploadFile, getFiles, deleteFile, queueUpload, processFile };
