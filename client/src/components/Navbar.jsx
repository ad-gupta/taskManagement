import React from "react";
import Header from "./Header";
import { LogoutSolid } from "@mynaui/icons-react";
import {
  loginRequest,
  logoutFail,
  logoutRequest,
  logoutSuccess,
} from "@/Reducers/user.js";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.user.isAuthenticated);
  
  const logout = async () => {
    try {
      dispatch(logoutRequest());

      const { data } = await axios.post("/api/user/logout");
      console.log("data", data);
      dispatch(logoutSuccess());
      navigate("/");
    } catch (error) {
      dispatch(logoutFail("error", error));
    }
  };

  return (
    <div className="">
      <Header />
      <nav className=" text-white shadow-md">
        <div className="container px-10 max-md:pr-0 py-4 flex justify-between items-center">
          {/* Logo Section */}
          <div className="text-xl font-bold flex gap-3">
            <h2 className="max-sm:text-sm text-blue-950">Dashboard</h2>
            <h2 className="max-sm:text-sm text-indigo-700">Task List</h2>
          </div>

          {/* Authentication Buttons */}
          <div className="space-x-4">
            {isAuth ? (
              <div className="">
                <button
                  onClick={logout}
                  className="bg-indigo-700 max-sm:hidden hover:bg-indigo-800 text-white px-4 py-2 rounded transition duration-200"
                >
                  Sign out
                </button>
                <div className="text-blue-950 sm:hidden">
                  <LogoutSolid />
                </div>
              </div>
            ) : (
              <>
                <Link to='/'
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-200"
                >
                  Login
                </Link>
                <Link to='/signup'
                  
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
