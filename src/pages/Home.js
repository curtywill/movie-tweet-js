import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, UserContext } from "../Context";
import Navbar from "../components/Navbar";

export default function Home() {
  const [movieQuery, setMovieQuery] = useState("");
  const { auth, setAuth } = useContext(AuthContext);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await fetch('http://localhost:4000/oauth/twitter/verify', { method: 'GET', credentials: 'include' });
      if(response.ok) {
        const { name, screenName, pfpURL } = await response.json();
        setUser({ name, screenName, pfpURL });
        setAuth(true);
      }
    })();
  }, []);

  const handleQuerySubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`http://localhost:4000/tmdb/fetch?query=${encodeURIComponent(movieQuery)}`, { method: 'GET' });
    const { results } = await response.json();
    navigate('/results', {
      state: {
        movies: results,
        movieQuery
      }
    });
  };

  const handleAuthorizationButton = async () => {
    const response = await fetch('http://localhost:4000/oauth/twitter', { method: 'GET', credentials: 'include' });
    const { authURL } = await response.json();
    window.location.href = authURL;
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col text-center items-center justify-center min-h-[90vh] min-w-full">
        <h1 className="text-5xl font-bold mb-10">Movie Tweet</h1>
        {auth
          ? <form onSubmit={handleQuerySubmit} className="w-[50%]">
              <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg aria-hidden="true" className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter a movie!"
                  value={movieQuery}
                  onChange={(event) => setMovieQuery(event.target.value)}
                  required
                >
                </input>
                <button 
                  type="submit" 
                  className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Search
                </button>
              </div>
            </form>
          : <button
              type="button"
              onClick={handleAuthorizationButton}
              className="text-white bg-[#1da1f2] hover:bg-[#1da1f2]/90 focus:ring-4 focus:outline-none focus:ring-[#1da1f2]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
            >
            <svg className="w-4 h-4 mr-2 -ml-1" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M459.4 151.7c.325 4.548 .325 9.097 .325 13.65 0 138.7-105.6 298.6-298.6 298.6-59.45 0-114.7-17.22-161.1-47.11 8.447 .974 16.57 1.299 25.34 1.299 49.06 0 94.21-16.57 130.3-44.83-46.13-.975-84.79-31.19-98.11-72.77 6.498 .974 12.99 1.624 19.82 1.624 9.421 0 18.84-1.3 27.61-3.573-48.08-9.747-84.14-51.98-84.14-102.1v-1.299c13.97 7.797 30.21 12.67 47.43 13.32-28.26-18.84-46.78-51.01-46.78-87.39 0-19.49 5.197-37.36 14.29-52.95 51.65 63.67 129.3 105.3 216.4 109.8-1.624-7.797-2.599-15.92-2.599-24.04 0-57.83 46.78-104.9 104.9-104.9 30.21 0 57.5 12.67 76.67 33.14 23.72-4.548 46.46-13.32 66.6-25.34-7.798 24.37-24.37 44.83-46.13 57.83 21.12-2.273 41.58-8.122 60.43-16.24-14.29 20.79-32.16 39.31-52.63 54.25z"></path></svg>
              Sign in with Twitter
            </button>
        }
      </div>
    </>
  );
}
