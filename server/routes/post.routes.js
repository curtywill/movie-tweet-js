const fs = require('fs')
const { TwitterApi } = require('twitter-api-v2')
const express = require('express');
const router = express.Router();

router.post('/twitter', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: req.session.accessToken,
    accessSecret: req.session.accessSecret
  });
  const { tweet } = req.fields;
  const posterPath = req.files.poster.path;
  let sentTweet;
  try {
    const mediaId = await client.v1.uploadMedia(posterPath);
    sentTweet = await client.v1.tweet(tweet, { media_ids: mediaId });
  } catch (error) {
    return res.status(400).send({ error });
  }
  // remove uploaded file after sending tweet
  fs.unlink(posterPath, (err) => {
    if (err) console.log(err);
  });

  res.status(200).send({ username: sentTweet.user.screen_name, tweetId: sentTweet.id_str });
});

module.exports = router;