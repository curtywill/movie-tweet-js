import '../App.css'
const BASE_IMG_URL = "https://image.tmdb.org/t/p/w200"

function MovieBox({movie}) {

  return (
    <div className="MovieBox">
      <img src={BASE_IMG_URL+movie.poster_path} />
      <p>{movie.original_title}</p>
    </div>
  )
}

export default MovieBox