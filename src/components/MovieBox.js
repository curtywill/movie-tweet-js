import { useEffect, useState } from 'react'
import '../App.css'
import { getMoviePoster } from '../utils/movieClient'

function MovieBox({ movie }) {
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
  
  const sendMovieTweet = async (title, release_date) => {
    let formData = new FormData()
    formData.append("title", title)
    formData.append("release_date", release_date)
    formData.append("poster", posterBlob, "poster.jpg")
    await fetch('http://localhost:4000/post/twitter', {
      method: "POST",
      mode: 'cors',
      credentials: 'include',
      body: formData
    })
  }

  return (
    <div className="MovieBox"
      onClick={() => {
        sendMovieTweet(movie.original_title, movie.release_date.slice(0, 4))
      }}>
      <img className="Poster" src={posterURL} alt="loading..." />
      <p>{movie.original_title}</p>
    </div>
  )
}

export default MovieBox