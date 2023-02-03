import UserDiv from "./UserDiv";
import { useContext } from "react";
import { AuthContext } from "../Context";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { auth } = useContext(AuthContext);

  return (
    <nav className="bg-white border-gray-200 px-2 sm:px-4 py-2.5 rounded">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <Link to="/">
          <h1 className="text-4xl font-extrabold">Movie Tweet</h1>
        </Link>
        {auth && <UserDiv />}
      </div>
    </nav>
  );
}