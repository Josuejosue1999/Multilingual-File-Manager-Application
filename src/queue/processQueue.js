const { uploadQueue } = require('./queue'); // Import the upload queue
const path = require('path');

// Process jobs from the uploadQueue
uploadQueue.process(async (job) => {
  try {
    console.log(`Processing file upload: ${job.data.fileName}`);
    // Simulate file upload or task processing
    await uploadFileToStorage(job.data);
    console.log(`File ${job.data.fileName} uploaded successfully!`);
  } catch (error) {
    console.error(`Error processing file ${job.data.fileName}:`, error);
  }
});

// Simulate file upload task (replace with actual logic)
async function uploadFileToStorage(fileData) {
  // For example, saving to cloud storage or local directory
  console.log(`Simulating upload for: ${fileData.fileName}`);
}

