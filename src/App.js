import "./App.css";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login";
import Registeration from "./pages/Registration";
import Profile from "./pages/Profile";
import PageNotFound from "./pages/PageNotFound";
import ChangePassword from "./pages/ChangePassword";
import { AuthContext } from "./helpers/AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  // const [authState, setAuthState] = useState(false);
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  // For Prevent the rerendering of login & registratinon link upon the reload.
  useEffect(() => {
    // if (localStorage.getItem("accessToken")) {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false }); // Grabbing the ...authState and change only the status to false.
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
    // }
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    // Clearing all the data.
    setAuthState({
      username: "",
      id: 0,
      status: false,
    });
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {/* If there is no variable in the sessionStorage called accessToken then display if there is the display the other */}
              {/* {!sessionStorage.getItem("accessToken") && ( */}
              {/* {!localStorage.getItem("accessToken") && ( */}
              {/* If this authState is true from the login.js in the Client it will not render the login link. */}
              {!authState.status ? (
                <>
                  <Link to="/login">Login</Link>
                  <Link to="/registration">Registeration</Link>
                </>
              ) : (
                <>
                  <Link to="/">Home Page</Link>
                  <Link to="/createpost">Create A Post</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1>{authState.username}</h1>
              {authState.status && <button onClick={logout}>Logout</button>}
            </div>
          </div>
          {/* Routes is instead of Switch --> tries to render the first component that it finds and satisfies the route that we put. */}
          <Routes>
            {/* exact never render more than one route at the same time. */}
            <Route path="/" exact Component={Home} />
            <Route path="/createpost" exact Component={CreatePost} />
            <Route path="/post/:id" exact Component={Post} />
            <Route path="/registration" exact Component={Registeration} />
            <Route path="/login" exact Component={Login} />
            <Route path="/profile/:id" exact Component={Profile} />
            <Route path="/changepassword" exact Component={ChangePassword} />
            <Route path="*" exact Component={PageNotFound} />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
