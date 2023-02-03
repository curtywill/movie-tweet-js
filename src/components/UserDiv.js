import { UserContext, AuthContext } from "../Context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function UserDiv() {
  const { user, setUser } = useContext(UserContext);
  const { setAuth } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setUser({});
    setAuth(false);
    await fetch("http://localhost:4000/oauth/logout", { method: 'GET', credentials: 'include' });
    navigate("/");
  };

  return (
    <div className="flex items-center md:order-2">
      <button className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0">
        <img className="w-8 h-8 rounded-full" src={user.pfpURL} alt="" />
      </button>
      <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
        <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white">
          <li>
            <button 
              className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0" 
              aria-current="page"
              onClick={handleSignOut}
            >
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}