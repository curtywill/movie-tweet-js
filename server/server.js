const express = require('express')
const session = require('express-session')
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
  }
}))

app.get('/oauth/twitter', async (req, res) => {
    const client = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET
    })
    const oauthLink = await client.generateAuthLink(CALLBACK_URL)
    if(!req.session.oauth_token) req.session.oauth_token = oauthLink.oauth_token
    if(!req.session.oauth_token_secret) req.session.oauth_token_secret = oauthLink.oauth_token_secret

    res.redirect(oauthLink.url)
})

app.get('/oauth/twitter/callback', (req, res) => {
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

  client.login(oauth_verifier)
    .then(({ client: loggedClient, accessToken, accessSecret }) => {
      loggedClient.v1.tweet("is this working")
    })
    .catch(() => res.status(403).send('Invalid verifier or access tokens!'));
})

app.listen(4000, () => {
    console.log("listening . . .")
})