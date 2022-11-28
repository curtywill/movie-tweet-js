import { useEffect, useState } from 'react'
import '../App.css'
import { getMoviePosterURL } from '../utils/movieClient'

function MovieBox({movie}) {
  const [posterURL, setPosterURL] = useState("")
  useEffect(() =>{
    const fetchURL = async() => {
      const url = await getMoviePosterURL(movie.poster_path)
      setPosterURL(url)
    }
    fetchURL()
  })

  return (
    <div className="MovieBox">
      <img className="Poster" src={posterURL} alt="loading..." />
      <p>{movie.original_title}</p>
    </div>
  )
}

export default MovieBox