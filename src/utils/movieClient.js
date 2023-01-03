const BASE_QUERY_URL = "https://api.themoviedb.org/3/search/movie?api_key=337e0f9a71da9b1b8f7a3a8f96f603a0"

const fetchMovieResults = async (query) => {
  const response  = await fetch(`${BASE_QUERY_URL}&query=${encodeURIComponent(query)}`, {method: "GET"})
  const {results} = await response.json()
  return results.filter(movie => movie.poster_path !== null && movie.release_date !== "")
}

const getMoviePoster = async (poster_path) => {
  const response = await fetch(`https://image.tmdb.org/t/p/original${poster_path}`, {method: "GET"})
  const blob = await response.blob()
  return blob
}

const sendMovieTweet = async (tweet, poster) => {
  let formData = new FormData()
  formData.append("tweet", tweet)
  formData.append("poster", poster, "poster.jpg")
  await fetch('http://localhost:4000/post/twitter', {
    method: "POST",
    mode: 'cors',
    credentials: 'include',
    body: formData
  })
}

export { fetchMovieResults, getMoviePoster, sendMovieTweet }