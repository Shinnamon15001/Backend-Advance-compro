require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use 3000 as a fallback if PORT is not defined

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
