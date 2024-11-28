const { uploadQueue } = require('../queue/queue');  // Import the queue

// Process jobs from the queue
uploadQueue.process(async (job) => {
  console.log(`Processing file: ${job.data.fileName}`);
  // Simulate the file upload or any background task
  await uploadFileToStorage(job.data);
  console.log('File uploaded successfully!');
});

async function uploadFileToStorage(fileData) {
  // Simulate file upload task here
  console.log(`Uploading ${fileData.fileName}...`);
}
