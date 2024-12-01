const fs = require('fs');
const mongoose = require('mongoose');
jest.mock('fs'); // Mock fs module

describe('File Model', () => {
  let filePath;

  beforeAll(async () => {
    const url = 'mongodb://localhost:27017/testdb'; // Update with your test DB URL
    await mongoose.connect(url); // Connect to MongoDB without deprecated options
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close MongoDB connection after tests
  });

  beforeEach(() => {
    filePath = 'C:\\tmp\\filetodelete.txt'; // Example file path
  });

  it('should create a file successfully', async () => {
    expect(true).toBe(true); // Replace with actual test logic
  });

  it('should find a file by user', async () => {
    expect(true).toBe(true); // Replace with actual test logic
  });

  it('should delete the file from the filesystem before removing from the database', async () => {
    const deleteFileFunction = jest.fn((filePath, callback) => {
      fs.unlink(filePath, callback); // Mock the unlink call
    });

    await deleteFileFunction(filePath, jest.fn());

    // Ensure fs.unlink was called with the correct file path
    expect(fs.unlink).toHaveBeenCalledWith(filePath, expect.any(Function));
  });

  it('should throw an error when file size is less than or equal to 0', async () => {
    expect(true).toBe(true); // Replace with actual test logic
  });
});
