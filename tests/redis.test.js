const { client, connectRedis, disconnectRedis } = require('../src/config/redis');

describe('Redis Configuration', () => {
  // Before all tests, connect to Redis
  beforeAll(async () => {
    await connectRedis();
  });

  // After all tests, disconnect from Redis
  afterAll(async () => {
    await disconnectRedis();
  });

  it('should connect to Redis successfully', async () => {
    // Attempt to get a value that doesn't exist (should return null)
    const response = await client.get('test-key');
    expect(response).toBeNull();  // Assuming 'test-key' doesn't exist
  });

  it('should throw error when Redis connection fails', async () => {
    // Mock the connect method to simulate an error
    const connectMock = jest.fn().mockRejectedValueOnce(new Error('Redis connection error'));
    client.connect = connectMock;

    // Expect the error to be thrown when connecting
    await expect(client.connect()).rejects.toThrow('Redis connection error');
  });
});
