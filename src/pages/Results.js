import React, { useEffect, useState } from "react"
import ReactModal from "react-modal"
import { useNavigate, useLocation } from "react-router-dom"
import '../App.css'
import MovieBox from "../components/MovieBox"

const MAX_TWEET_LENGTH = 280

export default function Results() {
  const [movies, setMovies] = useState([])
  const [selectedMovie, setSelectedMovie] = useState()
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [baseTweet, setBaseTweet] = useState("")
  const [comments, setComments] = useState("")
  const [watched, setWatched] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if(!selectedMovie) return 
    if (watched) setBaseTweet(`watched ${selectedMovie.title} (${selectedMovie.release_date}) `)
    else setBaseTweet(`watching ${selectedMovie.title} (${selectedMovie.release_date}) `)
  }, [selectedMovie, watched])

  useEffect(() => {
    if(location.state) setMovies(location.state.movies)
  }, [location.state])

  const handleTweetSubmit = async (event) => {
    event.preventDefault()
    //sendMovieTweet(tweet, selectedMovie.poster)
    let formData = new FormData()
    formData.append("tweet", baseTweet+comments)
    formData.append("poster", selectedMovie.poster, "poster.jpg")
    const response = await fetch('http://localhost:4000/post/twitter', {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      body: formData
    })
    if(response.ok) {
      const resJson = await response.json()
      navigate('/success', {
        state: {
          tweetId: resJson.tweetId
        }
      })
    }
  }

  ReactModal.setAppElement('#root') // hides all other content while modal is open

  return (
    <div>
      <div className="MoviesContainer">
        {movies.map(movie => <MovieBox key={movie.id} movie={movie} updateModalState={setModalIsOpen} updateMovieState={setSelectedMovie} />)}
      </div>
      <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <form onSubmit={handleTweetSubmit}>
          <label htmlFor="baseTweet">Base Tweet</label>
          <input id="baseTweet" value={baseTweet} readOnly />
          <label htmlFor="comments">Comments (optional)</label>
          <textarea
            id="comments"
            value={comments}
            maxLength={MAX_TWEET_LENGTH - baseTweet.length}
            onChange={(e) => setComments(e.target.value)} />
          <input type="checkbox" id="watched" onChange={() => { setWatched(!watched) }} />
          <label htmlFor="watched">Watched?</label>
          <input type="submit" value="Send Tweet!" />
        </form>
        <p>{(baseTweet + comments).length}/{MAX_TWEET_LENGTH}</p>
      </ReactModal>
    </div>
  )
}