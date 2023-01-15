import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

export default function Success() {
  const [tweetHtml, setTweetHtml] = useState("")

  const location = useLocation()

  useEffect(() => {
    const getTweetHtml = async () => {
      if(location.state.tweetId) {
        const response = await fetch(`http://localhost:4000/oembed/twitter?tweetId=${location.state.tweetId}`, {method: "GET" })
        if(response.ok) {
          const resJson = await response.json()
          setTweetHtml(resJson.tweetHtml)
        }
      }
    }
    getTweetHtml()
  }, [])

  if(!location.state) {
    return <h1>Access denied!</h1>
  }

  return (
    <div>
      <h1>Sent tweet!</h1>
      <div dangerouslySetInnerHTML={{__html: tweetHtml}} />
    </div>
  )
}
