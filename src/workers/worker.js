const { uploadQueue } = require('./uploadQueue');

console.log('[INFO] Worker started');
uploadQueue.process(async (job) => {
    console.log(`[PROCESSING] File: ${job.data.filePath}`);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`[SUCCESS] File processed: ${job.data.filePath}`);
});
