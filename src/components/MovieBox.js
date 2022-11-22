import '../App.css'
import {getMoviePosterURL} from '../utils/movieClient'

function MovieBox({movie}) {

  return (
    <div className="MovieBox">
      <img className="Poster" src={getMoviePosterURL(movie)} alt="loading..." />
      <p>{movie.original_title}</p>
    </div>
  )
}

export default MovieBox