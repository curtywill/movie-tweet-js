import { useEffect, useState } from 'react'
import { getMoviePoster } from '../utils/movieClient'

function MovieBox({ movie, updateModalState, updateMovieState }) {
  const [posterURL, setPosterURL] = useState("")
  const [posterBlob, setPosterBlob] = useState()
  useEffect(() => {
    const fetchURL = async () => {
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
      className="flex flex-col items-center bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 cursor-pointer min-w[30%] max-w-prose ml-28 mt-10"
      onClick={sendStateUp}>
      <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={posterURL} alt="" />
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{movie.original_title}</h5>
          <p className="mb-3 font-normal text-gray-700">{movie.overview}</p>
        </div>
    </div>
    /* <div 
      className="max-w-[200px] m-[30px] cursor-pointer border-2 border-black rounded"
      onClick={sendStateUp}>
      <img className="w-200 h-300" src={posterURL} alt="loading..." />
      <div>{movie.original_title}</div>
    </div> */
  )
}

export default MovieBox