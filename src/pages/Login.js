import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Grabbing the setAuthState from AuthContext...
  // we can now from this know which user is logged in by grabbing this authState usn it in the Delete Button.
  const { setAuthState } = useContext(AuthContext);
  let navigate = useNavigate();

  const login = () => {
    // data : is the data we re writing i the input as useState() :
    const data = { username: username, password: password };
    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      //   console.log(
      //     'the logged in user is from "client/pages/Login.js" : ',
      //     response.data
      //   );

      if (response.data.error) {
        alert(response.data.error);
      } else {
        //   else                 key           actual data.
        // sessionStorage.setItem("accessToken", response.data);
        localStorage.setItem("accessToken", response.data.token);
        // for rerendering the login and registration in App.js.
        // setAuthState(true);
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        });
        // After successfully login - go to the home page :
        navigate("/");
      }
    });
  };

  return (
    <div>
      <input
        type="text"
        onChange={(event) => {
          setUsername(event.target.value);
        }}
      ></input>
      <input
        type="password"
        onChange={(event) => {
          setPassword(event.target.value);
        }}
      ></input>

      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;
