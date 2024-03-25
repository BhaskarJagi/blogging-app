import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../../Slices/userSlice";
// import { toast } from "react-toastify";

function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:8000/auth/login", {
        loginId,
        password,
      });

      console.log(response);
      toast.success(response.data.message);
      setLoginId("");
      setPassword("");
      dispatch(setUser({
        ...response.data.data
      }))

      navigate("/blogs");
    } catch (error) {
      toast.error(error.response.data.error || error.response.data.message);
    }
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Email or Username"
          value={loginId}
          onChange={(e) => setLoginId(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
