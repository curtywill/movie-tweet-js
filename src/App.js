import { useEffect, useState } from "react"
import './App.css'
import MovieBox from "./components/MovieBox"
import { fetchMovieResults } from "./utils/movieClient"

function App() {
 
  const [movieQuery, setMovieQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  
  useEffect(() => {
    const check = async () => {
      const response = await fetch('http://localhost:4000/oauth/twitter/verify', {method:'GET', credentials: 'include'})
      const { authorized } = await response.json()
      setIsAuthorized(authorized)
    }
    check()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault() // prevents page from refreshing on submit
    const results = await fetchMovieResults(movieQuery)
    setMovies(results)
  }

  const handleButton = async (event) => {
    const response = await fetch('http://localhost:4000/oauth/twitter', {method:'GET', credentials: 'include'})
    const { authURL } = await response.json()
    window.location.href = authURL
  }

  // controlled component: input form's value is controlled by React
  return (
    <div className="App">
      <h1>Movie Tweet</h1>
      {isAuthorized ? <form onSubmit={handleSubmit}> 
        <input
          placeholder="Enter a movie!"
          value={movieQuery}
          onChange={(event) => setMovieQuery(event.target.value)}>
        </input>
      </form>
      : <button type="button" onClick={handleButton}>Authorize!</button>
      }
      <div className="MoviesContainer">
        {movies.map(movie => <MovieBox key={movie.id} movie={movie} />)}
      </div>
    </div>
  )
}

export default App