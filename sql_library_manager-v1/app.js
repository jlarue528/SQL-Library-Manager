var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const router = express.Router();

var indexRouter = require('./routes/index');
const { Server } = require('http');
const e = require('express');
const { restart } = require('nodemon');

const sequelize = require('./models').sequelize;

var app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

/*
  404 Error Handler
*/

app.use((req, res, next) => {
  const error = new Error(`Page AIN'T HERE`);
  error.status = 404;
  error.message = 'Sorry, this was not found.'
  res.render('page-not-found', { error });
});

/*
  Global Error Handler
*/

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  err.message = err.message || `Uh oh - looks like our server is acting up`;
  console.log('ERROR:', err.message);
  res.render('error', { err }); 
});

sequelize.authenticate().then(() => {
  console.log('CONNECTION SUCCESSFUL!');
}).catch(err => {
  console.log('Unable to connect', err);
}); 

sequelize.sync().then(() => {
  console.log('Models Synced');
});

app.listen(3000);

module.exports = app;
