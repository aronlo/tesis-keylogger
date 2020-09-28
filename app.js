var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var logger = require('morgan')
var favicon = require('express-favicon');
var useragent = require('express-useragent');
require('dotenv').config()


var indexRouter = require('./routes/index')
var signUpRouter = require('./routes/signUp')
var impostorRouter = require('./routes/impostor')
var logoutRouter = require('./routes/logout')
var wsRouter = require('./routes/ws')

var compression = require('compression')
var helmet = require('helmet')

var app = express()


// Set up mongoose connection
var mongoose = require('mongoose')
var mongoDB = process.env.MONGODB_URL
mongoose.connect(mongoDB, { useNewUrlParser: true })
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', () => {
    console.log('Mongo database conected!')
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
app.use(useragent.express())
//app.use(helmet())
app.use(compression())


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/favicon.ico'));

app.use('/', indexRouter)
app.use('/signup', signUpRouter)
app.use('/impostor', impostorRouter)
app.use('/logout', logoutRouter)
app.use('/ws', wsRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app