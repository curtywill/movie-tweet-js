const BASE_QUERY_URL = "https://api.themoviedb.org/3/search/movie?api_key=337e0f9a71da9b1b8f7a3a8f96f603a0"
const BASE_IMG_URL = "https://image.tmdb.org/t/p/original"

const fetchMovieResults = async (query) => {
  const response  = await fetch(`${BASE_QUERY_URL}&query=${encodeURIComponent(query)}`)
  const {results} = await response.json()
  return results.filter(filterMovies)
}

const filterMovies = movie => movie.poster_path !== null && movie.release_date !== ""

const getMoviePosterURL = movie => BASE_IMG_URL+movie.poster_path
 

export {fetchMovieResults, getMoviePosterURL}