import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Success from "./pages/Success";
import { AuthContext, UserContext } from "./Context";

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/results" element={<Results />} />
          <Route path="/success" element={<Success />} />
        </Routes>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;