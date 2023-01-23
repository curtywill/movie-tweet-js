import { useEffect, useState } from 'react';

const BASE_IMG_URL = `https://image.tmdb.org/t/p/original`

function MovieBox({ movie, updateModalState, updateMovieState }) {
  const [posterURL, setPosterURL] = useState("");
  const [posterBlob, setPosterBlob] = useState();
  useEffect(() => {
    (async () => {
      setPosterURL(BASE_IMG_URL+movie.poster_path);
      const response = await fetch(BASE_IMG_URL+movie.poster_path, { method: 'GET' });
      const blob = await response.blob();
      setPosterBlob(blob);
    })();
  }, [movie.poster_path]);

  const sendStateUp = () => {
    updateMovieState({
      title: movie.original_title,
      release_date: movie.release_date.substring(0, 4),
      poster: posterBlob
    });
    updateModalState(true);
  };

  return (
    <div
      className="flex flex-col items-center bg-white border rounded-lg shadow-md md:flex-row md:max-w-xl hover:bg-gray-100 cursor-pointer min-w[30%] max-w-prose ml-28 mt-10"
      onClick={sendStateUp}>
      <img className="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src={posterURL} alt="" />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">{movie.original_title}</h5>
        <p className="mb-3 font-normal text-gray-700">({movie.release_date.substring(0, 4)})</p>
      </div>
    </div>
  );
}

export default MovieBox;