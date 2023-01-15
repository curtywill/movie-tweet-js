import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Results from "./pages/Results"
import Success from "./pages/Success"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<Results />} />
      <Route path="/success" element={<Success />} />
    </Routes>
  )
}

export default App