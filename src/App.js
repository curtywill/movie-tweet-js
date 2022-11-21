import {useState} from "react"
import './App.css'
import MovieBox from "./components/MovieBox"
const BASE_QUERY_URL = "https://api.themoviedb.org/3/search/movie?api_key=337e0f9a71da9b1b8f7a3a8f96f603a0"
function App() {
 
  const [movieQuery, setMovieQuery] = useState("")
  const [movies, setMovies] = useState([])
  const handleSubmit = event => {
    event.preventDefault() // prevents page from refreshing on submit

    fetch(`${BASE_QUERY_URL}&query=${encodeURIComponent(movieQuery)}`)
    .then(response => response.json())
    .then(response => setMovies(response.results))
  }
  // controlled component: input form's value is controlled by React
  return (
    <div className="App">
      <h1>Movie Tweet</h1>
      <form onSubmit={handleSubmit}> 
        <input 
          value={movieQuery}
          onChange={(event) => setMovieQuery(event.target.value)}>
        </input>
      </form>
      <div className="MoviesContainer">
        {movies.filter(movie => movie.poster_path !== null && movie.release_date !== "")
          .map(movie => (
            <MovieBox key={movie.id} movie={movie}/>
        ))}
      </div>
    </div>
  )
}

export default App
