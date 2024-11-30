// queue/queue.js
const Queue = require('bull');  // Import Bull

// Set up the queue with Redis configuration
const uploadQueue = new Queue('uploadQueue', {
  redis: require('../config/redisConfig')  // Import Redis config from config/redisConfig.js
});

// Process the queue - This part is where you define what to do with the job once it's processed
uploadQueue.process(async (job) => {
  const { file, description } = job.data;
  try {
    console.log('Processing file:', file);
    // Handle the file processing logic here
    // For example, saving it to a storage system, or processing the file
    return Promise.resolve();
  } catch (error) {
    console.error('Error processing job:', error);
    throw error;  // Optional: re-throw the error to let Bull handle retries or failure
  }
});

// Event listeners for job completion and failure
uploadQueue.on('completed', (job, result) => {
  console.log(`Job ${job.id} completed successfully!`);
});

uploadQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err}`);
});

module.exports = uploadQueue;
