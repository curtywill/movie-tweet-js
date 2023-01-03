import { useEffect, useState } from 'react'
import '../App.css'
import { getMoviePoster } from '../utils/movieClient'

function MovieBox({ movie, updateModalState, updateMovieState }) {
  const [posterURL, setPosterURL] = useState("")
  const [posterBlob, setPosterBlob] = useState()
  useEffect(() => {
    const fetchURL = async() => {
      const blob = await getMoviePoster(movie.poster_path)
      //const arrayBuff = await blob.arrayBuffer()
      setPosterBlob(blob)
      setPosterURL(URL.createObjectURL(blob))
    }
    fetchURL()
  }, [])
  
  const sendStateUp = () => {
    updateMovieState({
      title: movie.original_title,
      release_date: movie.release_date.substring(0, 4),
      poster: posterBlob
    })
    updateModalState(true)
  }

  return (
    <div className="MovieBox"
      onClick={sendStateUp}>
      <img className="Poster" src={posterURL} alt="loading..." />
      <p>{movie.original_title}</p>
    </div>
  )
}

export default MovieBox