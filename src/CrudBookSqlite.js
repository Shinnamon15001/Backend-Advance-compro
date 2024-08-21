require('dotenv').config();

const port = process.env.PORT || 3000;
const express = require("express");
const sqlite3 = require("sqlite3");
const app = express();

const db = new sqlite3.Database("./Database/Book.sqlite");

app.use(express.json());

// Correct the typo in CREATE TABLE statement
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY, 
    title TEXT,
    author TEXT
)`);

app.get('/books', (req, res) => {
    // Correct the typo in SQL statement
    db.all('SELECT * FROM books', (err, rows) => {
        if (err) {
            res.status(500).send(err);  // Corrected resizeBy to res
        } else {
            res.json(rows);  // Corrected resizeBy to res
        }
    });
});

app.get('/books/:id', (req, res) => {
    db.get('SELECT * FROM books WHERE id = ?', req.params.id, (err, row) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (!row) {
                res.status(404).send("Book not found");
            } else {
                res.json(row);
            }
        }
    });
});

app.post('/books', (req, res) => {
    const book = req.body;
    // Corrected db.run method
    db.run('INSERT INTO books (title, author) VALUES (?, ?)', book.title, book.author, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            book.id = this.lastID;
            res.send(book);
        }
    });
});

app.put('/books/:id', (req, res) => {
    const book = req.body;
    // Use book object from request body
    db.run('UPDATE books SET title = ?, author = ? WHERE id = ?', book.title, book.author, req.params.id, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(book);
        }
    });
});

app.listen(port, () => {
    console.log(`Example app at http://localhost:${port}`);
});
