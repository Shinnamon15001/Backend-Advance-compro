require("dotenv").config();

const express = require("express")
const app = express()
const port = process.env.PORT;

app.use(express.json());

let books = [
    {
        id: 1,
        title: 'Book1',
        author: 'Author1'
    },
    {
        id: 2,
        title: 'Book2',
        author: 'Author2'
    },
    {
        id: 3,
        title: 'Book3',
        author: 'Author3'
    },
]

app.get('/books', (req, res) => {
    res.json(books);
});

app.get('/books/:id', (req, res) => {
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) res.status(404).send('Book not found');
    res.json(book);
});

app.post('/books', (req,res) => {
    const book = {
        id: books.length + 1,
        title: req.body.title,
        author: req.body.author
    };
    books.push(book);
    res.send(book);
});

app.listen(port,
    () => {
        console.log(`Example app at http://localhost:${port}`);
    }
);