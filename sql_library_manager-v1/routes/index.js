var express = require('express');
var router = express.Router();
const Book = require('../models').Book;


/* GET home page. */
router.get('/', async function(req, res, next) {
  const allBooks = await Book.findAll();
  res.json({allBooks});
});

module.exports = router;