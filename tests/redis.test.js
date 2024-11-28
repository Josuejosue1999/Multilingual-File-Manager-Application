const redis = require('../src/config/redis');
const { promisify } = require('util');

describe('Redis Configuration', () => {
  it('should connect to Redis successfully', async () => {
    const getAsync = promisify(redis.get).bind(redis);
    const response = await getAsync('test-key');
    expect(response).toBeNull();
  });

  it('should throw error when Redis connection fails', async () => {
    // Simulate Redis failure
    redis.quit = jest.fn().mockImplementationOnce(() => {
      throw new Error('Redis connection error');
    });

    await expect(redis.quit()).rejects.toThrow('Redis connection error');
  });
});
