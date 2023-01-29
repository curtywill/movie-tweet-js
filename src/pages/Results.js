import React, { useEffect, useState, useContext } from "react";
import ReactModal from "react-modal";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import MovieBox from "../components/MovieBox";
import Navbar from "../components/Navbar";
import { AuthContext } from "../Context";
const MAX_TWEET_LENGTH = 280;

export default function Results() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [baseTweet, setBaseTweet] = useState("");
  const [comments, setComments] = useState("");
  const [watched, setWatched] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (!selectedMovie) return;
    if (watched) setBaseTweet(`watched ${selectedMovie.title} (${selectedMovie.release_date}) `);
    else setBaseTweet(`watching ${selectedMovie.title} (${selectedMovie.release_date}) `);
  }, [selectedMovie, watched]);

  useEffect(() => {
    if (location.state) setMovies(location.state.movies);
  }, [location.state]);

  const handleTweetSubmit = async (event) => {
    event.preventDefault();
    let formData = new FormData();
    formData.append("tweet", baseTweet + comments);
    formData.append("poster", selectedMovie.poster, "poster.jpg");
    const response = await fetch('http://localhost:4000/post/twitter', {
      method: "POST",
      credentials: 'include',
      body: formData
    });
    if (response.ok) {
      const { username, tweetId } = await response.json();
      navigate('/success', {
        state: {
          username,
          tweetId
        }
      });
    }
  };

  if (!auth) return <Navigate to="/" replace />;
  ReactModal.setAppElement('#root'); // hides all other content while modal is open

  return (
    <>
      <Navbar />
      <div className="grid grid-cols-2">
        {movies.map(movie => <MovieBox key={movie.id} movie={movie} updateModalState={setModalIsOpen} updateMovieState={setSelectedMovie} />)}
      </div>
      <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="absolute top-0 bottom-0 left-0 right-0 m-auto bg-white border border-gray-200 shadow-md max-w-[50%] max-h-[60%]">
        <div className="w-full h-full p-4 rounded-lg sm:p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleTweetSubmit}>
            <div>
              <label htmlFor="base-tweet" className="block mb-2 text-sm font-medium text-gray-900">Base Tweet</label>
              <input
                id="base-tweet"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={baseTweet}
                readOnly />
            </div>
            <div>
              <label htmlFor="comments" className="block mb-2 text-sm font-medium text-gray-900">Comments (optional)</label>
              <textarea
                rows={6}
                id="comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full max-h-[30%] p-2.5 resize-none" />
            </div>
            <div className="flex items-start">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="watched"
                    type="checkbox"
                    onChange={() => setWatched(!watched)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300" />
                </div>
                <label htmlFor="watched" className="ml-2 text-sm font-medium">Watched?</label>
              </div>
              <p className="ml-auto text-sm font-medium">{(baseTweet + comments).length}/{MAX_TWEET_LENGTH}</p>
            </div>
            <button
              type="submit"
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Send Tweet!</button>
          </form>
        </div>
      </ReactModal>
    </>
  );
}