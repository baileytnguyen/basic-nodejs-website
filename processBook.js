const fs = require('fs');
const path = require('path');
const { createClient } = require('redis');

const redis = createClient();
redis.connect();

async function processBookToRedis(bookFileName, redisKey) {
    const filePath = path.join(__dirname, 'books', bookFileName);
    const text = fs.readFileSync(filePath, 'utf8');

    const words = text
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3);

    const frequency = {};
    for (const word of words) {
        frequency[word] = (frequency[word] || 0) + 1;
    }

    await redis.hSet(redisKey, frequency);
    console.log(`✅ Processed and cached: ${bookFileName}`);
}

async function processAllBooks() {
    // ❌ Delete all old book:*:words keys
    const oldKeys = await redis.keys('book:*:words');
    if (oldKeys.length > 0) {
        await redis.del(oldKeys);
        console.log(`🗑️ Deleted ${oldKeys.length} old Redis keys`);
    }

    // ✅ Re-process current .txt files
    const booksDir = path.join(__dirname, 'books');
    const files = fs.readdirSync(booksDir).filter(f => f.endsWith('.txt'));

    for (const file of files) {
        const key = `book:${file.replace('.txt', '')}:words`;
        await processBookToRedis(file, key);
    }

    await redis.quit();
}

module.exports = { processAllBooks };

