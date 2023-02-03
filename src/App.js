import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Success from "./pages/Success";
import { AuthContext, UserContext } from "./Context";
import RequireAuth from "./components/RequireAuth";

function App() {
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <UserContext.Provider value={{ user, setUser }}>
        <Routes>
          <Route path="/" 
            element={<Home />} 
          />
          <Route path="/results" 
            element={
              <RequireAuth>
                <Results />
              </RequireAuth>
            } 
          />
          <Route path="/success" 
            element={
              <RequireAuth>
                <Success />
              </RequireAuth>
            } />
        </Routes>
      </UserContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;