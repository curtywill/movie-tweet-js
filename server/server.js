const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const { TwitterApi } = require('twitter-api-v2')
const CALLBACK_URL = 'http://localhost:4000/oauth/twitter/callback'
require('dotenv').config()

const app = express()

// TODO: configure mongo session store, look into touch method
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*60*24
  },
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/db',
    collectionName: 'sessions'
  })
}))

app.get('/oauth/twitter', async (req, res) => {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET
    })
    const oauthLink = await client.generateAuthLink(CALLBACK_URL)
    req.session.oauth_token = oauthLink.oauth_token
    req.session.oauth_token_secret = oauthLink.oauth_token_secret

    res.redirect(oauthLink.url)
})

app.get('/oauth/twitter/callback', async (req, res) => {
  const {oauth_verifier} = req.query
  const {oauth_token, oauth_token_secret} = req.session

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send('You denied the app or your session expired!');
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret
  })
  
  const {accessToken, accessSecret } = await client.login(oauth_verifier)

  if (!accessToken || !accessSecret) res.status(403).send('Invalid verifier or access tokens!')
  req.session.accessToken = accessToken
  req.session.accessSecret = accessSecret
  res.status(200).send("Sucessfully authorized!")
})

app.get('/tweet', (req, res) => {
  const { tweet } = req.query
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: req.session.accessToken,
    accessSecret: req.session.accessSecret
  })
  
  client.v1.tweet(tweet)
    .then(() => {
      res.status(200).send('sucessfully tweeted ' + tweet)
    })
    .catch((error) => {
      res.status(400).send(error)
    })
})

app.listen(4000, () => {
    console.log("listening . . .")
})