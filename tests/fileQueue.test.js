const fileUploadQueue = require('../src/queues/fileQueue');
const { File } = require('../src/models');
jest.mock('../src/models/File');  // Mock the File model

describe('File Queue', () => {
  it('should process the file upload job and save file metadata', async () => {
    const mockJob = {
      id: 1,
      data: {
        fileName: 'test-file.txt',
        userId: 1,
      },
    };

    // Mock the file saving to the database
    File.create = jest.fn().mockResolvedValue({ name: mockJob.data.fileName, path: `/uploads/${mockJob.data.fileName}` });

    // Process the job
    await fileUploadQueue.process(mockJob);

    // Assertions
    expect(File.create).toHaveBeenCalledWith({
      name: mockJob.data.fileName,
      path: `/uploads/${mockJob.data.fileName}`,
      ownerId: mockJob.data.userId,
    });
  });

  it('should handle errors when processing the job', async () => {
    const mockJob = {
      id: 1,
      data: {
        fileName: 'test-file.txt',
        userId: 1,
      },
    };

    // Simulate an error when creating the file
    File.create = jest.fn().mockRejectedValue(new Error('Database error'));

    await expect(fileUploadQueue.process(mockJob)).rejects.toThrow('Database error');
  });
});
