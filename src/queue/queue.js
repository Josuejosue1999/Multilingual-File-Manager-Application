const Queue = require('bull');
const redisClient = require('../../redisClient'); // Import the Redis client

// Create a queue using Redis connection
const uploadQueue = new Queue('uploadQueue', {
  redis: {
    host: redisClient.options.host,  // Use your Redis client connection settings
    port: redisClient.options.port,
  },
});

// Add a job to the queue
function addUploadJob(fileData) {
  uploadQueue.add(fileData); // Add job to the queue
}

module.exports = { uploadQueue, addUploadJob };
