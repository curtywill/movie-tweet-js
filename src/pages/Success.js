import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Success() {
  const [tweetURL, setTweetURL] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (!location.state) return;
    setTweetURL(`https://twitter.com/${location.state.username}/status/${location.state.tweetId}`);
  }, [location.state]);

  return (
    <>
      <Navbar />
      <div className="flex flex-col justify-center center-items text-center">
        <h1 className="text-5xl font-bold pb-10 pt-10">Sent tweet!</h1>
        <a href={tweetURL} className="text-4xl font-medium text-blue-600 dark:text-blue-500 hover:underline" target="_blank" rel="noreferrer">View here</a>
      </div>
    </>
  );
}
