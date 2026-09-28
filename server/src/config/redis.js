import Redis from 'ioredis';
import dotenv from 'dotenv';

import fs from 'fs';
import path from 'path';

dotenv.config();

const CACHE_FILE = path.join(process.cwd(), '.quiz_cache.json');

function loadMemoryStore() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const data = fs.readFileSync(CACHE_FILE, 'utf8');
      return new Map(Object.entries(JSON.parse(data)));
    }
  } catch (err) {}
  return new Map();
}

function saveMemoryStore(store) {
  try {
    const obj = Object.fromEntries(store);
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj), 'utf8');
  } catch (err) {}
}

const memoryStore = loadMemoryStore();
let redisClient = null;
let isRedisAvailable = false;

if (process.env.REDIS_URL && !process.env.REDIS_URL.includes('your-redis')) {
  try {
    redisClient = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      lazyConnect: true
    });

    redisClient.connect()
      .then(() => {
        isRedisAvailable = true;
        console.log('Redis connected successfully.');
      })
      .catch((err) => {
        console.warn('Redis unavailable, using memory fallback:', err.message);
        isRedisAvailable = false;
      });
  } catch (err) {
    console.warn('Redis initialization bypassed:', err.message);
    isRedisAvailable = false;
  }
}

export const cache = {
  async get(key) {
    if (isRedisAvailable && redisClient) {
      try {
        const val = await redisClient.get(key);
        return val ? JSON.parse(val) : null;
      } catch {
        return memoryStore.get(key) || null;
      }
    }
    return memoryStore.get(key) || null;
  },

  async set(key, value, ttlSeconds = 300) {
    if (isRedisAvailable && redisClient) {
      try {
        await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return;
      } catch {
        // Fallback to memory
      }
    }
    memoryStore.set(key, value);
    saveMemoryStore(memoryStore);
    
    // Auto-expire memory item
    setTimeout(() => {
      memoryStore.delete(key);
      saveMemoryStore(memoryStore);
    }, ttlSeconds * 1000);
  },

  async del(key) {
    if (isRedisAvailable && redisClient) {
      try {
        await redisClient.del(key);
      } catch {
        // Ignored
      }
    }
    memoryStore.delete(key);
    saveMemoryStore(memoryStore);
  }
};
