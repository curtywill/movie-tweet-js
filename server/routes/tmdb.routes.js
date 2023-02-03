const express = require('express');
const router = express.Router();

const BASE_QUERY_URL = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}`;

router.get('/fetch', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { query } = req.query;
  try {
    const response  = await fetch(`${BASE_QUERY_URL}&query=${query}`, { method: 'GET' });
    const { results } = await response.json();
    res.status(200).send({ results: results.filter(movie => !!movie.poster_path && !!movie.release_date) });
  } catch(err) {
    res.status(400).send({ msg: "Error fetching movie results!", err});
  }
});

module.exports = router;