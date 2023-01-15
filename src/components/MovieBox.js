import { useEffect, useState } from 'react'
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
    <div 
      className="max-w-[200px] m-[30px] cursor-pointer border-2 border-black rounded"
      onClick={sendStateUp}>
      <img className="w-200 h-300" src={posterURL} alt="loading..." />
      <div>{movie.original_title}</div>
    </div>
  )
}

export default MovieBox