const File = require('../models/File'); // Model for File
const fs = require('fs');
const uploadQueue = require('../queues/uploadQueue'); // Importing the queue

// Upload a file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Create a new file entry
        const newFile = new File({
            user: req.user ? req.user._id : null,
            name: req.file.originalname,
            path: req.file.path,
            mimeType: req.file.mimetype,
            size: req.file.size,
            description: req.body.description || '',
            description: req.body.description || '',
        });

        // Save the file metadata to the database
        await newFile.save();

        // Add the file to the processing queue
        await uploadQueue.add({
            fileId: newFile._id,
            filePath: req.file.path,
            fileName: req.file.originalname,
            description: req.body.description || '',
        });

        console.log(`[INFO] File queued successfully: ${newFile.name}`);
        return res.status(201).json({
            message: 'File uploaded and queued successfully',
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

// Fetch all files
const getFiles = async (req, res) => {
    try {
        const files = await File.find();
        console.log(`[INFO] Retrieved ${files.length} file(s)`);
        return res.status(200).json({ files });
    } catch (error) {
        console.error(`[ERROR] Fetching files: ${error.message}`);
        res.status(500).json({ message: 'Error fetching files', error: error.message });
    }
};

// Delete a file
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await File.findById(id);

        if (!file) {
            console.warn(`[WARNING] File not found: ID ${id}`);
            return res.status(404).json({ message: 'File not found' });
        }

        // Delete the file from the filesystem
        if (fs.existsSync(file.path)) {
            // Supprimer le fichier du système de fichiers
            fs.unlinkSync(file.path);
            console.log(`[INFO] File deleted from filesystem: ${file.path}`);
        }

        // Remove the file entry from the database
        await File.findByIdAndDelete(id);

        res.status(200).json({ message: `File with ID ${id} deleted successfully` });
    } catch (error) {
        console.error(`[ERROR] Deleting file: ${error.message}`);
        res.status(500).json({ message: 'Error deleting file', error: error.message });
    }
};

// Queue upload handler
const queueUpload = async (req, res) => {
    try {
        const { fileId, filePath, fileName, description } = req.body;

        // Add the file to the processing queue
        await uploadQueue.add({ fileId, filePath, fileName, description });
        console.log(`[INFO] File queued successfully: ${fileName}`);
        return res.status(200).json({ message: 'File added to the queue successfully' });
    } catch (error) {
        console.error(`[ERROR] Adding file to queue: ${error.message}`);
        return res.status(500).json({ message: 'Error adding file to the queue', error: error.message });
    }
};

// Get queue status
const getQueueStatus = async (req, res) => {
    try {
        const waiting = await uploadQueue.getWaiting();
        const active = await uploadQueue.getActive();
        const completed = await uploadQueue.getCompleted();
        const failed = await uploadQueue.getFailed();

        const formatJob = (job) => ({
            id: job.id,
            data: job.data,
            progress: job.progress || 0,
            timestamp: job.timestamp,
            finishedOn: job.finishedOn || null,
            failedReason: job.failedReason || null,
        });

        const status = {
            waiting: waiting.map(formatJob),
            active: active.map(formatJob),
            completed: completed.map(formatJob),
            failed: failed.map(formatJob),
        };

        console.log(`[INFO] Queue status retrieved successfully`);
        return res.status(200).json(status);
    } catch (error) {
        console.error(`[ERROR] Fetching queue status: ${error.message}`);
        return res.status(500).json({ message: 'Error fetching queue status', error: error.message });
    }
};

module.exports = { uploadFile, getFiles, deleteFile, queueUpload, getQueueStatus };
