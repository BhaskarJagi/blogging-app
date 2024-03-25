import React from "react";
import Header from "../Components/common/Header";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../Slices/userSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  async function handleLogout(){
    try{
      const response = await axios.post("http://localhost:8000/auth/logout")

      dispatch(setUser(null))
      // navigate("/authentication")

      toast.success(response.data.message)
    }catch(error){
      toast.error(error.response.data.message)
    }
  }

  return (
    <div>
      <Header />
      <h1>Hi! Welcome</h1>
      <h3>
        <span>Name : </span>
        {user.name}
      </h3>
      <h3>
        <span>Usename : </span>
        {user.username}
      </h3>
      <h3>
        <span>Email : </span>
        {user.email}
      </h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Profile;
