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

    res.send(oauthLink)

})

app.get('/oauth/twitter/callback', () => {

})

app.listen(4000, () => {
    console.log("listening . . .")
})