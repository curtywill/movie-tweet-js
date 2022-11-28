const BASE_QUERY_URL = "https://api.themoviedb.org/3/search/movie?api_key=337e0f9a71da9b1b8f7a3a8f96f603a0"

const fetchMovieResults = async (query) => {
  const response  = await fetch(`${BASE_QUERY_URL}&query=${encodeURIComponent(query)}`, {method: "GET"})
  const {results} = await response.json()
  return results.filter(movie => movie.poster_path !== null && movie.release_date !== "")
}

const getMoviePosterURL = async (poster_path) => {
  const response = await fetch(`https://image.tmdb.org/t/p/original${poster_path}`, {method: "GET"})
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}


export { fetchMovieResults, getMoviePosterURL }