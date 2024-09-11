const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// MongoDB connection (ensure you replace <dburl> with your actual MongoDB URI)
mongoose.connect(
    "mongodb://admin:XTAiln75831@node66902-env-3579406.proen.app.ruk-com.cloud:11586",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the Book schema and model
const bookSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true,
    },
    title: String,
    author: String,
    publishedYear: Number,  // Add publishedYear to match CRUD operations
}, { timestamps: true });  // Automatically adds createdAt and updatedAt

const Book = mongoose.model("Book", bookSchema);

const app = express();
app.use(bodyParser.json());

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Book API!');
});

// CRUD Operations

// Create a new book
app.post('/books', async (req, res) => {
    try {
        const { id, title, author, publishedYear } = req.body;
        const book = new Book({ id, title, author, publishedYear });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all books
app.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Read a single book by ID
app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findOne({ id });
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a book by ID
app.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishedYear } = req.body;
        const book = await Book.findOneAndUpdate(
            { id },
            { title, author, publishedYear },
            { new: true }  // Return the updated document
        );
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a book by ID
app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findOneAndDelete({ id });
        if (book) {
            res.status(204).send();
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
