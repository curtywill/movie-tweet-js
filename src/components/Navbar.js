import UserDiv from "./UserDiv";
import { useContext } from "react";
import { AuthContext } from "../Context";

export default function Navbar() {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="http://localhost:3000/" className="flex items-center">
          <h1>Movie Tweet</h1>
        </a>
        {auth && <UserDiv />}
      </div>
    </nav>
  );
}