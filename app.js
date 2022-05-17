var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nanoId = require('nanoid');
var fs = require('fs');
var htmlLinks = '<link rel="stylesheet" href="/stylesheets/style.css">';


// var indexRouter = require('./routes/index');
var userRouter = require('./routes/booksApi');
// var booksRouter = require('./routes/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), { index: false }));



app.use('/booksApi', userRouter);
// app.use('/books', booksRouter);

app.get('/', (req, res, next) => {

    let books = [];
    if (fs.existsSync) {
        books = JSON.parse(fs.readFileSync('./books.json'));
    }
    //     let lists;
    //     for (let i = 0; i <a books.length; i++) {
    //         if (!books[i].rented) {
    //             lists += `<div>
    //                         <h1>Bokens namn: ${books[i].bookname}</h1>
    //                         <h2>Författaren: ${books[i].author}</h2>
    //                         <h3>Antal blad: ${books[i].pagesnr}</h3>
    //                         <div>Lägg till en ny book<a href='/books/newBook'></a></div>
    //                     </div>`;
    //         } else {
    //             lists += `<div>
    //                         <h1>Bokens namn: ${books[i].bookname}</h1>
    //                         <h2>Den är utlånad :(</h2>
    //                         <div>Lägg till en ny book<a href='/books/newBook'></a></div>
    //                     </div>`;
    //         }
    //     }
    // res.send(lists);


    let printBooks = `<div><h1>Böckerna</h1>`;
    books.forEach(book => {
        printBooks += `
    <div> ${book.bookName} <a href="/${book.id}">Låna</a></div>`;
    });

    printBooks += `<div><br><a id='addNewBok' href='/newBook'>Lägg till en ny book</a>
    <br><br>
    <a id='addNewBok' href=/booksApi>Gå till BooksApi</a>
    </div></div>`;

    res.send(htmlLinks + printBooks);

});

app.get('/newBook', (req, res) => {
    let form = `
            <h2>Lägg till en ny bok :)</h2>
                <form action="saveBooks" method="post">
                    <label>Bokens namn</label>
                    <input type="text" name="bookName"/>
                    <label>Bokens författare</label>
                    <input type="text" name="author"/>
                    <label>Bokens sidor</label>
                    <input type="number" name="pagesNr"/>
                    <button class='Btn' type="submit">Spara</button>
                </form>`;
    res.send(htmlLinks + form);
});

app.get('/:id', (req, res) => {
    let books = [];
    if (fs.existsSync) {
        books = JSON.parse(fs.readFileSync('./books.json'));
    }
    let foundBook = books.find((book) => book.id === req.params.id);
    if (!foundBook) { return res.send("Ingen Bok Hittades med Id " + req.params.id); }
    let bookInfo = `
    <div>
        <h3>Bokens namn: ${foundBook.bookName}</h3>
        <h3>Författaren: ${foundBook.author}</h3>
        <h3>Antal sidor: ${foundBook.pagesNr}</h3>
        <h3>${foundBook.rented ? "Uthyrd" : `
       <button class='Btn' onclick = "location.href='/rentBook/${foundBook.id}'">Hyra</button>
        `}</h3>
        <button class='Btn'  onclick = "location.href='/deleteBok/${foundBook.id}'">Radera</button>
    </div>`;
    res.send(htmlLinks + bookInfo);
});

app.get('/rentBook/:id', (req, res) => {
    let books = [];
    if (fs.existsSync) {
        books = JSON.parse(fs.readFileSync('./books.json'));
    }
    let foundBook = books.find((book) => book.id == req.params.id);
    let bookIndex = books.findIndex((book) => book.id == req.params.id);
    let rentedBook = { ...foundBook, rented: true };
    books.splice(bookIndex, 1);
    books.push(rentedBook);
    fs.writeFileSync('./books.json', JSON.stringify(books, null, 2));

    res.send(htmlLinks + `<h3>Tack för din bestälning 😊 </h3>
    <a href='/'><button class='Btn'>Start Sida</button></a>`);
});
app.get('/deleteBok/:id', (req, res) => {
    let books = [];
    if (fs.existsSync) {
        books = JSON.parse(fs.readFileSync('./books.json'));
    }
    let foundBook = books.find((book) => book.id == req.params.id);
    let bookIndex = books.findIndex((book) => book.id == req.params.id);
    books.splice(bookIndex, 1);
    fs.writeFileSync('./books.json', JSON.stringify(books, null, 2));

    res.send(htmlLinks + `<h3>Nu booken ${foundBook.bookName} är raderat 😊 </h3>
    <a href='/'><button class='Btn'>Start Sida</button></a>`);
});


app.post('/saveBooks', (req, res) => {
    let books = [];
    if (fs.existsSync) {
        books = JSON.parse(fs.readFileSync('./books.json'));
    }
    if (req.body.bookName === '' || req.body.author === '' || req.body.pagesNr === '') {
        return res.send(htmlLinks + `Error 'Fel' Fyll i formuläret tack!<br><br><a href='/'><button class='Btn'>Start Sida</button></a>`);
    } else {
        let newBook = { ...req.body, id: nanoId.nanoid(), rented: false };
        books.push(newBook);
        fs.writeFileSync('./books.json', JSON.stringify(books, null, 2));
        return res.redirect("/");

    }
});


// router.use(express.json())

// router.post('/', (req, res) => {
//     const { Name, lastName } = req.body
//     console.log(Name, lastName);

//     if (Name < 3) {
//         res.status(400).json({
//             status: "Failed",
//             error: "Name must be more than 6 characters"
//         })
//     }

//     // res.status(204).send("Tackar")
//     res.status(201).json({
//         status: "Created",
//         Name,lastName,id:"12"
//     });
// })


module.exports = app;
