var express = require('express');
var router = express.Router();
var fs = require('fs')

/* GET users listing. */
router.get('/', function (req, res, next) {
    let books = [];
    if (fs.existsSync) {
        books = JSON.parse(fs.readFileSync('./books.json'));
    }
    res.json(books);
});

module.exports = router;
