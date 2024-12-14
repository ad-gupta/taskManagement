import { loginFail, loginRequest, loginSuccess } from "@/Reducers/user";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(loginRequest());
      const { data } = await axios.post("/api/user/login", {
        email,
        password,
      });
      dispatch(loginSuccess({ payload: data.user }));
      navigate("/tasks");
    } catch (error) {
      dispatch(
        loginFail({
          payload: "error.response.data.message",
        })
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Welcome to To-do app
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="email ID"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-medium py-2 rounded transition duration-300"
          >
            Sign in to continue
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Not registered?{" "}
          <Link
            to="/signup"
            className="text-indigo-500 hover:text-indigo-600 font-medium"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
