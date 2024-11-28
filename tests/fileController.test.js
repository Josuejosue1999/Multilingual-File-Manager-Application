const request = require('supertest');
const app = require('../src/app');  // Your Express app
const fileUploadQueue = require('../src/queues/fileQueue');
const { File } = require('../src/models');
jest.mock('../src/queues/fileQueue');  // Mock the file queue

describe('File Controller', () => {
  it('should upload a file and add it to the queue', async () => {
    // Mock the file object passed in the request
    const mockFile = {
      filename: 'test-file.txt',
      path: 'uploads/test-file.txt',
    };

    // Mock user authentication
    const mockUser = { id: 1 };

    // Mock the file creation in the database
    File.create = jest.fn().mockResolvedValue({ name: mockFile.filename, path: mockFile.path });

    // Mock adding a job to the Redis queue
    fileUploadQueue.add = jest.fn().mockResolvedValue({ id: 1 });

    // Make a POST request to upload the file
    const response = await request(app)
      .post('/api/files/upload')
      .attach('file', mockFile.path)
      .set('Authorization', `Bearer fake-jwt-token`)  // Mock authorization
      .expect(201);

    // Assertions
    expect(response.body.message).toBe('File upload queued');
    expect(fileUploadQueue.add).toHaveBeenCalledWith({
      fileName: mockFile.filename,
      userId: mockUser.id,
    });
    expect(File.create).toHaveBeenCalledWith({
      name: mockFile.filename,
      path: `/uploads/${mockFile.filename}`,
      ownerId: mockUser.id,
    });
  });

  it('should return an error if file upload fails', async () => {
    // Simulate a failure in the file creation process
    File.create = jest.fn().mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .post('/api/files/upload')
      .expect(500);

    expect(response.body.error).toBe('Database error');
  });
});
