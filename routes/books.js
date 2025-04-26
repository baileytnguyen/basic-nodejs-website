const express = require('express');
const { createClient } = require('redis');
const router = express.Router();

const redis = createClient();
redis.connect();

// Route to render the books page with a list of available books
router.get('/', async (req, res) => {
    console.log("heelo");
    try {
        // Fetch all keys related to books (assuming books are stored as keys like `book:<bookName>:words`)
        const keys = await redis.keys('book:*:words');

        // Extract book names from the keys (e.g., "book:bookName:words" => "bookName")
        const books = keys.map(key => key.split(':')[1]);

        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found.' });
        }

        // Render the books.jade template and pass the books to it
        res.render('books', { books });
    } catch (err) {
        console.error('Error fetching books:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API Route to get word frequency stats for a selected book
router.get('/stats', async (req, res) => {
    const { bookName } = req.query; // Get book name from query params

    if (!bookName) {
        return res.status(400).json({ error: 'Book name is required.' });
    }

    const redisKey = `book:${bookName}:words`;

    try {
        // Fetch word frequencies for the selected book
        const wordFreq = await redis.hGetAll(redisKey);

        if (Object.keys(wordFreq).length === 0) {
            return res.status(404).json({ message: 'No word data found for this book.' });
        }

        // Convert word frequencies to an array of objects suitable for the pie chart
        const chartData = Object.keys(wordFreq).map(word => ({
            name: word,
            y: parseInt(wordFreq[word]),
        }));

        // Send back the word frequency data as JSON
        res.json({ bookName, wordFreq: chartData });

    } catch (err) {
        console.error('Error fetching word frequencies:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
