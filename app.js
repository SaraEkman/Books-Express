var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const nanoId = require('nanoid');

// var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
// var booksRouter = require('./routes/books');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'),{index:false}));


app.use('/user', userRouter);
// app.use('/books', booksRouter);



let books = [{
    id: nanoId.nanoid(),
    bookName: "Lilla barnkammarboken : sånger, rim och ramsor för hela kroppen", author: "Annika Persson", pagesNr: 200, rented: false
}, {
    id: nanoId.nanoid(),
    bookName: "Det anstår mig icke att göra mig mindre än jag är och andra citat av kvinnor", author: "Josefine Stenersen Nilsson", pagesNr: 155, rented: false
}, {
    id: nanoId.nanoid(),
    bookName: "Pixi adventskalender - Jan Lööf", author: "Annika Persson", pagesNr: 300, rented: false
}, {
    id: nanoId.nanoid(),
    bookName: "MiniPixi säljförpackning 3", author: "Maja Hagerman", pagesNr: 250, rented: true
}];




app.get('/', (req, res, next) => {
    console.log(books);
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
    <div> ${book.bookName} <a href="/${book.id}">Låna</a></div>
    `;
    });

    printBooks += `<div><a href='/newBook'>Lägg till en ny book</a></div></div>`;

    res.send(printBooks);

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
                    <button type="submit">Spara</button>
                </form>`;
    res.send(form);
});

app.get('/:id', (req, res) => {
    let foundBook = books.find((book) => book.id === req.params.id);
    if (!foundBook) { return res.send("Ingen Bok Hittades med Id " + req.params.id); }

    let bookInfo = `
    <div>
        <h3>${foundBook.bookName}</h3>
        <h3>${foundBook.author}</h3>
        <h3>${foundBook.pagesNr}</h3>
        <h3>${foundBook.rented ? "Uthyrd" : `
       <button onclick = "location.href='/rentBook/${foundBook.id}'">Hyra</button></a>
        `}</h3>
    </div>`;


    res.send(bookInfo);
});

app.get('/rentBook/:id', (req, res) => {
    let foundBook = books.find((book) => book.id == req.params.id);
    let bookIndex = books.findIndex((book) => book.id == req.params.id);
    let rentedBook = { ...foundBook, rented: true };
    books.splice(bookIndex, 1);
    books.push(rentedBook);

    res.send(`<h3>Tack för din bestälning 😊 </h3>
    <a href='/'><button>Start Sida</button></a>
    `);
});


app.post('/saveBooks', (req, res) => {
    let newBook = { ...req.body, id: nanoId.nanoid(), rented: false };

    books.push(newBook);
    res.redirect("/");
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
