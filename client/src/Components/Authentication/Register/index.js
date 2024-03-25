import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Register({ flag, setFlag }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/auth/register", {
        name,
        email,
        username,
        password,
      });
      const user = response.data.data;
      // console.log(response.data);
      toast.success(response.data.message);

      setEmail("");
      setName("");
      setUsername("");
      setPassword("");

      setFlag(!flag);
    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  return (
    <div>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="User Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
