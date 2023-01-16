import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchMovieResults } from "../utils/movieClient"

export default function Home() {
  const [movieQuery, setMovieQuery] = useState("")
  const [isAuthorized, setIsAuthorized] = useState(false)

  const navigate = useNavigate()

  // TODO: make useEffect async functions instantlly invoked
  useEffect(() => {
    const check = async () => {
      const response = await fetch('http://localhost:4000/oauth/twitter/verify', { method: 'GET', credentials: 'include' })
      const { authorized } = await response.json()
      setIsAuthorized(authorized)
    }
    check()
  }, [])

  const handleQuerySubmit = async (event) => {
    event.preventDefault()
    const results = await fetchMovieResults(movieQuery)
    navigate('/results', {
      state: {
        movies: results
      }
    })
  }

  const handleAuthorizationButton = async () => {
    const response = await fetch('http://localhost:4000/oauth/twitter', { method: 'GET', credentials: 'include' })
    const { authURL } = await response.json()
    window.location.href = authURL
  }

  return (
    <div className="flex flex-col text-center items-center justify-center min-h-screen min-w-full">
      <h1 className="text-5xl">Movie Tweet</h1>
      {isAuthorized
        ? <form onSubmit={handleQuerySubmit} className="w-[50%] mt-10">
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
              required>
            </input>
            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">Search</button>
          </div>
        </form>
        : <button type="button" onClick={handleAuthorizationButton}>Authorize!</button>
      }
    </div>
  )
}
