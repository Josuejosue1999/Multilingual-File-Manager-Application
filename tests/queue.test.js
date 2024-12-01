const uploadQueue = require('../src/queues/queue');

describe('Upload Queue', () => {
  let job;

  beforeAll(async () => {
    // Clear the queue before starting the tests to ensure no leftover jobs
    await uploadQueue.empty();
  });

  afterAll(async () => {
    // Close the Redis connection after all tests are done
    await uploadQueue.close();
  });

  it('should add a job to the queue and process it', async () => {
    // Add a job to the queue with mock data
    job = await uploadQueue.add({
      file: 'path/to/testfile.txt',
      description: 'Test file upload',
    });

    expect(job).toHaveProperty('id');  // Check if the job has an ID

    // Listen for job completion
    const completedJob = new Promise((resolve, reject) => {
      uploadQueue.on('completed', (completedJob) => {
        console.log(`Test completed for job ${completedJob.id}.`);
        resolve(completedJob);
      });

      uploadQueue.on('failed', (failedJob, err) => {
        reject(`Test failed for job ${failedJob.id} with error: ${err}`);
      });
    });

    // Wait for the job to be processed and completed
    await completedJob;
  });
});
