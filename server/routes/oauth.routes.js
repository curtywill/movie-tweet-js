const { TwitterApi } = require('twitter-api-v2')
const express = require('express');
const router = express.Router();

router.get('/twitter', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET
  });
  const oauthLink = await client.generateAuthLink(process.env.CALLBACK_URL);
  req.session.oauth_token = oauthLink.oauth_token;
  req.session.oauth_token_secret = oauthLink.oauth_token_secret;

  const authURL = oauthLink.url;
  res.status(200).send({ authURL });
});

router.get('/twitter/callback', async (req, res) => {
  const { oauth_verifier } = req.query;
  const { oauth_token, oauth_token_secret } = req.session;

  if (!oauth_token || !oauth_verifier || !oauth_token_secret) {
    return res.status(400).send('You denied the app or your session expired!');
  }

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: oauth_token,
    accessSecret: oauth_token_secret
  });

  const { accessToken, accessSecret } = await client.login(oauth_verifier);

  if (!accessToken || !accessSecret) res.status(403).send('Invalid verifier or access tokens!');
  req.session.accessToken = accessToken;
  req.session.accessSecret = accessSecret;
  res.redirect('http://localhost:3000/');
});

router.get('/twitter/verify', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const authorized = !(req.session.accessToken === undefined || req.session.accessSecret === undefined);
  if(!authorized) return res.sendStatus(400);

  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: req.session.accessToken,
    accessSecret: req.session.accessSecret
  });

  const { name, screen_name: screenName, profile_image_url_https: pfpURL } = await client.currentUser();
  return res.status(200).send({ name, screenName, pfpURL });
});

module.exports = router;