const express = require('express')
const session = require('express-session')
const formidable = require('express-formidable')
const cors = require('cors')
const MongoStore = require('connect-mongo')

const { TwitterApi } = require('twitter-api-v2')
const CALLBACK_URL = 'http://localhost:4000/oauth/twitter/callback'
require('dotenv').config()

const app = express()

app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(express.json())
app.use(formidable())

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

    const authURL = oauthLink.url
    res.status(200).send({ authURL })
})

app.get('/oauth/twitter/callback', async (req, res) => {
  const { oauth_verifier } = req.query
  const { oauth_token, oauth_token_secret } = req.session
  
  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send('You denied the app or your session expired!');
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret
  })
  
  const { accessToken, accessSecret } = await client.login(oauth_verifier)

  if (!accessToken || !accessSecret) res.status(403).send('Invalid verifier or access tokens!')
  req.session.accessToken = accessToken
  req.session.accessSecret = accessSecret
  res.redirect('http://localhost:3000/')
})

app.get('/oauth/twitter/verify', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  const authorized = !(req.session.accessToken === undefined || req.session.accessSecret === undefined)
  res.send({ authorized })
})

app.post('/post/twitter', async (req, res) => {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: req.session.accessToken,
    accessSecret: req.session.accessSecret
  })
  const { tweet } = req.fields
  // const arrayBuff = await posterBlob.arrayBuffer()
  // const poster = Buffer.from(arrayBuff, 'binary')
  const mediaId = await client.v1.uploadMedia(req.files.poster.path)
  await client.v1.tweet(tweet, {media_ids: mediaId})
})

app.listen(4000, () => {
    console.log("listening on port 4000. . .")
})