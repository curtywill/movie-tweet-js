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
      const response = await fetch('http://localhost:4000/oauth/twitter/verify', {method:'GET', credentials: 'include'})
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
    const response = await fetch('http://localhost:4000/oauth/twitter', {method:'GET', credentials: 'include'})
    const { authURL } = await response.json()
    window.location.href = authURL
  }

  return (
    <div className="w-full text-center">
      <h1>Movie Tweet</h1>
      {isAuthorized ? <form onSubmit={handleQuerySubmit}> 
        <input
          placeholder="Enter a movie!"
          value={movieQuery}
          onChange={(event) => setMovieQuery(event.target.value)}>
        </input>
      </form>
      : <button type="button" onClick={handleAuthorizationButton}>Authorize!</button>
      }
    </div>
  )
}
