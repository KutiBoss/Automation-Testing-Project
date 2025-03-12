require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
//const cookieParser = require('cookie-parser');
const expressHbs = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const MongoStore = require('connect-mongo');

const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mydatabase';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fallbacksecret';

// MongoDB Connection with error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// View engine setup
app.engine('.hbs', expressHbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set('view engine', '.hbs');

// Middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cookieParser());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: MONGODB_URI }),
  cookie: { maxAge: 180 * 60 * 1000, httpOnly: true, secure: process.env.NODE_ENV === 'production' }
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// Make session available in views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Routes
app.use('/', routes);

// Handle 404 errors
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: err });
  });
} else {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', { message: err.message, error: {} });
  });
}

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

module.exports = app;

