var express = require('express');
var router = express.Router();
const { json } = require("express/lib/response");
const EventEmitter = require('events');
const nanoId = require('nanoid');
const event = new EventEmitter();

//Testning 

router.get('/', (req, res, next) => {
    console.log(books);

    let printBooks = `<div><h1>Böckerna</h1>`;
    books.forEach(book => {
        printBooks += `
    <div> ${book.bookName} <a href="/books/${book.id}">Låna</a></div>
    `;
    });

    printBooks += `<div><a href='/books/newBook'>Lägg till en ny book</a></div></div>`;

    res.send(printBooks);

});

router.get('/newBook', (req, res) => {
    let form = `
            <h2>Lägg till en ny bok :)</h2>
                <form action="saveBooks" method="post">
                    <label>Bokens namn</label>
                    <input type="text" name="bookName"/>
                    <label>Bokens författare</label>
                    <input type="text" name="author"/>
                    <label>Bokens sidor</label>
                    <input type="number" name="pagesNr"/>
                    <button type="submit">Spara</button>
                </form>`;
    res.send(form);
});

router.get('/:id', (req, res) => {
    let foundBook = books.find((book) => book.id === req.params.id);
    if (!foundBook) { return res.send("Ingen Bok Hittades med Id " + req.params.id); }

    let bookInfo = `
    <div>
        <h3>${foundBook.bookName}</h3>
        <h3>${foundBook.author}</h3>
        <h3>${foundBook.pagesNr}</h3>
        <h3>${foundBook.rented ? "Uthyrd" : `
       <button onclick = "location.href='/books/rentBook/${foundBook.id}'">Hyra</button></a>
        `}</h3>
    </div>`;


    res.send(bookInfo);
});

router.get('/rentBook/:id', (req, res) => {
    let foundBook = books.find((book) => book.id == req.params.id);
    let bookIndex = books.findIndex((book) => book.id == req.params.id);
    let rentedBook = { ...foundBook, rented: true };
    books.splice(bookIndex, 1);
    books.push(rentedBook);

    res.send(`<h3>Tack för din bestälning 😊 </h3>
    <a href='/books'><button>Start Sida</button></a>
    `);
});


router.post('/saveBooks', (req, res) => {
    let newBook = { ...req.body, id: nanoId.nanoid(), rented: false };

    books.push(newBook);
    res.redirect("/books");
});

module.exports = router;

