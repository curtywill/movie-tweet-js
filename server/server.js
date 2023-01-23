const express = require('express');
const session = require('express-session');
const formidable = require('express-formidable');
const cors = require('cors');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

app.use(formidable({
  uploadDir: './uploads',
  keepExtensions: true
}));

app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "lax"
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/db',
    collectionName: 'sessions'
  })
}));

const oauthRouter = require('./routes/oauth.routes');
const postRouter  = require('./routes/post.routes');
const tmdbRouter  = require('./routes/tmdb.routes');

app.use('/oauth', oauthRouter);
app.use('/post', postRouter);
app.use('/tmdb', tmdbRouter);

app.listen(4000, () => {
  console.log("listening on port 4000. . .");
});