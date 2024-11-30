const Queue = require('bull');
const fs = require('fs');

// Configuration de la file d'attente
const uploadQueue = new Queue('file-upload', {
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379,
    },
});

// Traitement des tâches
uploadQueue.process(async (job) => {
    const { fileId, filePath, description } = job.data;

    console.log(`[INFO] Processing job for file: ${filePath || 'undefined'} with ID: ${fileId || 'undefined'}`);

    try {
        // Vérifiez si le fichier existe
        if (!filePath || !fs.existsSync(filePath)) {
            throw new Error(`File not found or invalid filePath: ${filePath}`);
        }

        // Simulez un traitement (par exemple, compression ou conversion)
        console.log(`[INFO] Starting processing for file: ${filePath}`);
        console.log(`[INFO] Description: ${description}`);

        // Mise à jour de la progression
        for (let i = 0; i <= 100; i += 20) {
            await new Promise((resolve) => setTimeout(resolve, 500)); // Simule un délai
            job.progress(i); // Mise à jour de la progression
            console.log(`[INFO] Job ID: ${job.id} is ${i}% complete.`);
        }

        console.log(`[SUCCESS] Job completed for file: ${filePath}`);
    } catch (error) {
        console.error(`[ERROR] Job failed for file: ${filePath || 'undefined'}. Error: ${error.message}`);
        throw error; // Relance l'erreur pour enregistrer l'échec
    }
});

// Gestion des événements
uploadQueue.on('completed', (job) => {
    console.log(`[SUCCESS] Job ID: ${job.id} completed successfully.`);
    console.log(`[INFO] Job Data: ${JSON.stringify(job.data)}`);
});

uploadQueue.on('failed', (job, err) => {
    console.error(`[FAILED] Job ID: ${job.id} failed. Error: ${err.message}`);
    console.error(`[INFO] Job Data: ${JSON.stringify(job.data)}`);
});

// Événements supplémentaires pour diagnostic
uploadQueue.on('active', (job) => {
    console.log(`[INFO] Job ID: ${job.id} is now active.`);
});

uploadQueue.on('waiting', (jobId) => {
    console.log(`[INFO] Job ID: ${jobId} is waiting.`);
});

uploadQueue.on('stalled', (job) => {
    console.warn(`[WARNING] Job ID: ${job.id} has stalled.`);
});

uploadQueue.on('progress', (job, progress) => {
    console.log(`[INFO] Job ID: ${job.id} is ${progress}% complete.`);
});

// Gestion des erreurs globales de la file d'attente
uploadQueue.on('error', (error) => {
    console.error(`[ERROR] Redis Queue encountered an error: ${error.message}`);
});

module.exports = uploadQueue;
