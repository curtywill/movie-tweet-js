import React, { useEffect, useState } from "react"
import ReactModal from "react-modal"
import { useNavigate } from "react-router-dom"
import '../App.css'
import MovieBox from "../components/MovieBox"
import { fetchMovieResults, sendMovieTweet } from "../utils/movieClient"

export function Home() {
  const [movieQuery, setMovieQuery] = useState("")
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [tweet, setTweet] = useState("")

  const navigate = useNavigate()
  
  useEffect(() => {
    const check = async () => {
      const response = await fetch('http://localhost:4000/oauth/twitter/verify', {method:'GET', credentials: 'include'})
      const { authorized } = await response.json()
      setIsAuthorized(authorized)
    }
    check()
  }, [])

  useEffect(() => {
    if(selectedMovie) setTweet(`watching ${selectedMovie.title} (${selectedMovie.release_date})`)
  }, [selectedMovie])

  const handleAuthorizationSubmit = async (event) => {
    event.preventDefault() // prevents page from refreshing on submit
    const results = await fetchMovieResults(movieQuery)
    setMovies(results)
  }

  const handleAuthorizationButton = async (event) => {
    const response = await fetch('http://localhost:4000/oauth/twitter', {method:'GET', credentials: 'include'})
    const { authURL } = await response.json()
    window.location.href = authURL
  }

  const handleTweetSubmit = async (event) => {
    event.preventDefault()
    //sendMovieTweet(tweet, selectedMovie.poster)
    let formData = new FormData()
    formData.append("tweet", tweet)
    formData.append("poster", selectedMovie.poster, "poster.jpg")
    const response = await fetch('http://localhost:4000/post/twitter', {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      body: formData
    })
    if(response.ok) {
      navigate('/success')
    }
  }

  ReactModal.setAppElement('#root') // hides all other content while modal is open
  // controlled component: input form's value is controlled by React
  return (
    <div className="App">
      <h1>Movie Tweet</h1>
      {isAuthorized ? <form onSubmit={handleAuthorizationSubmit}> 
        <input
          placeholder="Enter a movie!"
          value={movieQuery}
          onChange={(event) => setMovieQuery(event.target.value)}>
        </input>
      </form>
      : <button type="button" onClick={handleAuthorizationButton}>Authorize!</button>
      }
      <div className="MoviesContainer">
        {movies.map(movie => <MovieBox key={movie.id} movie={movie} updateModalState={setModalIsOpen} updateMovieState={setSelectedMovie}/>)}
      </div>
      <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <form onSubmit={handleTweetSubmit}>
          <label htmlFor="tweet" value="Tweet" />
          <textarea id="tweet" value={tweet} onChange={(e) =>setTweet(e.target.value)} />
          <input type="submit" value="Send Tweet!" />
        </form>
      </ReactModal>
    </div>

  )
}
