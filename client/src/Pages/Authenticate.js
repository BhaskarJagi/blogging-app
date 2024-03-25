import React, { useState } from "react";
import Header from "../Components/common/Header";
import Register from "../Components/Authentication/Register";
import Login from "../Components/Authentication/Login";

function Authenticate() {
  const [flag, setFlag] = useState(false);

  return (
    <div>
      <Header />
      <div>
        {!flag ? <h1>Register</h1> : <h1>Login</h1>}
        {!flag ? <Register flag={flag} setFlag={setFlag} /> : <Login />}
        {!flag ? (
          <p className="clickable" onClick={() => setFlag(!flag)}>
            Already have an Account? Click here to Login.
          </p>
        ) : (
          <p className="clickable" onClick={() => setFlag(!flag)}>
            Don't have an Account? Click here to Register.
          </p>
        )}
      </div>
    </div>
  );
}

export default Authenticate;
