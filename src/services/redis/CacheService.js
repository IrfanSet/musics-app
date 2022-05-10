const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

 
  async set(key, value, expirationInSecond = 30*60) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  // get cache
  async get(key) {
    const result = await this._client.get(key);
    if (result === null) throw new Error('No Cache');
    return result;
  }

  // delete cache
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
