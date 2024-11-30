const Redis = require('ioredis');

// Create a new Redis client to connect to the Redis server
const redis = new Redis({
  host: '127.0.0.1', // Redis host
  port: 6379,        // Redis port
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;
