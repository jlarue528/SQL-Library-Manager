var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/** 
 * Handler function to wrap each route
*/
function asyncHandler(cb) {
  return async(req, res, next) => {
    try{
      await cb(req,res,next)
    } catch (error) {
      res.send(error);
    }
  }
}

/* GET Landing Page */
router.get('/', asyncHandler( async (req, res) => {
  res.redirect('/books');
}));

router.get('/books', asyncHandler(async (req, res) => {
  const allBooks = await Book.findAll();
  res.render('index', { books: allBooks, title: 'Books'});
}));

/* GET New Book Page */
router.get('/books/new', asyncHandler(async (req, res) => {
  res.render('new-book', { title: 'New Book' });
}));

/* POST New Book Page */
router.post('/books/new', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect('/books/' + book.id)
  } catch (error){
    if(error.name === 'SequelizeValidationError') {
      book = await Book.build(req.body);
      res.render('/books/new', {book, errors: error.errors, title: 'New Book'});
    } else {
      throw error;
    }
  }
}));

/* GET Book Page */
router.get('/books/:id', asyncHandler(async (req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
      res.render('update-book', { book, title: 'Update Book'});
    } else {
      next();
    } 
}));

/* POST Book Update Page */
router.post('/books/:id', asyncHandler(async (req, res) => {
    let book;
    try {
      const book = await Book.findByPk(req.params.id);
      if(book) {
        await book.update(req.body);
        await book.save();
        res.redirect('/books');
      } else {
        next();
      }
    } catch (error) {
      if(error.name === 'SequelizeValidationError') {
        book = await Book.build(req.body);
        book.id = req.params.id;
        res.render('/books/:id', { book, errors: errors.errors, title: 'Update Book'})
      }
    }
})); 

/* POST Delete Book */
router.post('/books/:id/delete', asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect('/books');
  } else {
    next();
  }
}));

module.exports = router;