import {useState} from "react"
import './App.css'
import MovieBox from "./components/MovieBox"
import {fetchMovieResults} from "./utils/movieClient"

function App() {
 
  const [movieQuery, setMovieQuery] = useState("")
  const [movies, setMovies] = useState([])
  
  const handleSubmit = async (event) => {
    event.preventDefault() // prevents page from refreshing on submit
    const results = await fetchMovieResults(movieQuery)
    setMovies(results)
  }

  // controlled component: input form's value is controlled by React
  return (
    <div className="App">
      <h1>Movie Tweet</h1>
      <form onSubmit={handleSubmit}> 
        <input
          placeholder="Enter a movie!"
          value={movieQuery}
          onChange={(event) => setMovieQuery(event.target.value)}>
        </input>
      </form>
      <div className="MoviesContainer">
        {movies.map(movie => <MovieBox key={movie.id} movie={movie}/>)}
      </div>
    </div>
  )
}

export default App
