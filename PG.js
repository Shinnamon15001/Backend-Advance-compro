const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const app = express();

app.use(express.json());

const dbURL = 'postgres://webadmin:NYYdcs99031@node66903-env-3579406.proen.app.ruk-com.cloud:11561/Books'; 

// Initialize Sequelize
const sequelize = new Sequelize(dbURL, {
    logging: false, // Disable SQL logging (optional)
});

// Test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    publishedYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

// Sync the database
sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// Helper function to convert UTC to local time
function convertToLocalTime(utcDate) {
    const localDate = new Date(utcDate);
    return localDate.toLocaleString();  
}

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Book API!');
});

// CRUD Operations
app.post('/books', async (req, res) => {
    try {
        const { title, author, publishedYear } = req.body;
        const book = await Book.create({ title, author, publishedYear });
        res.status(201).json({
            ...book.toJSON(),
            createdAt: convertToLocalTime(book.createdAt),
            updatedAt: convertToLocalTime(book.updatedAt)
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        const booksWithLocalTime = books.map(book => ({
            ...book.toJSON(),
            createdAt: convertToLocalTime(book.createdAt),
            updatedAt: convertToLocalTime(book.updatedAt)
        }));
        res.json(booksWithLocalTime);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        if (book) {
            res.json({
                ...book.toJSON(),
                createdAt: convertToLocalTime(book.createdAt),
                updatedAt: convertToLocalTime(book.updatedAt)
            });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, publishedYear } = req.body;
        const book = await Book.findByPk(id);
        if (book) {
            book.title = title;
            book.author = author;
            book.publishedYear = publishedYear;
            await book.save();
            res.json({
                ...book.toJSON(),
                createdAt: convertToLocalTime(book.createdAt),
                updatedAt: convertToLocalTime(book.updatedAt)
            });
        } else {
            res.status(404).json({ error: 'Book not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);
        if (book) {
            await book.destroy();
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
