import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { userDetailsFail, userDetailsRequest, userDetailsSuccess } from "./Reducers/user";
import axios from "axios";

const loadUser = async (dispatch) => {
  try {
    dispatch(userDetailsRequest());
    
    const {data} = await axios.get('/api/user/me')

    dispatch(userDetailsSuccess(data.user));
  } catch (error) {
    dispatch(userDetailsFail("something went wrong"))
  }
}
function App() {
  let isAuth = useState(useSelector(state => state.user))
  isAuth = isAuth[0].isAuthenticated;
  // console.log(isAuth)
  const dispatch = useDispatch()

  useEffect(() => {
    isAuth && loadUser(dispatch);
  }, [isAuth, dispatch])

  return (
    <div className="m-1">
      <Navbar />
      <Routes>
        <Route path="/">
          <Route index element={<Login />} />
          <Route path= "/signup" element={<Signup />} />
          <Route exact path="/tasks" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
