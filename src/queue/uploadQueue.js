const Queue = require('bull');
const uploadQueue = new Queue('uploads', process.env.REDIS_URL);

uploadQueue.process(async (job) => {
  console.log(`Processing: ${job.data.file}`);
});

module.exports = uploadQueue;
