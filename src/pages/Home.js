import React, { useContext } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { AuthContext } from "../helpers/AuthContext";

const Home = () => {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const { authState } = useContext(AuthContext);
  // let history = useHistory();
  let navigate = useNavigate();

  useEffect(() => {
    // First Check if the user loggedin - if not redirect him into the login page if he is logged in show the home page for him.
    // if (!authState.status) {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    } else {
      axios
        .get("http://localhost:3001/posts", {
          headers: { accessToken: localStorage.getItem("accessToken") },
        })
        .then((response) => {
          setListOfPosts(response.data.listOfPosts);
          setLikedPosts(
            response.data.likedPosts.map((like) => {
              return like.postId;
            })
          );
        });
    }
  }, []);

  const likeAPost = (postId) => {
    // 1) Make a req to our end point :
    axios
      .post(
        "http://localhost:3001/like",
        { PostId: postId },
        { headers: { accessToken: localStorage.getItem("accessToken") } }
      )
      .then((response) => {
        // alert(response.data);

        // Update an object inside a state : grabbing the list and modefying it and we setting the state of the list to equal the modefied list.
        setListOfPosts(
          listOfPosts.map((post) => {
            if (post.id === postId) {
              if (response.data.liked) {
                // Keep the post elements as it is & change the Likes field & the Kep the likes as it is and Add a ZERO at the end of this array.
                return { ...post, Likes: [...post.Likes, 0] };
              } else {
                // A) Copy the existing likes array
                const likesArray = post.Likes;
                // B) Remove the last element of the array.
                likesArray.pop();
                // C) Deleting the Like number from the array.
                return { ...post, Likes: likesArray };
              }
            } else {
              return post;
            }
          })
        );

        // Rerendering automatically after liking a post :

        if (likedPosts.includes(postId)) {
          // when we never like a post and it never had been liked we wanna remove
          setLikedPosts(
            likedPosts.filter((id) => {
              return id != postId;
            })
          );
        } else {
          setLikedPosts([...likedPosts, postId]); // get a copy of teh likeposts aray and add postId.
        }
      });
  };

  return (
    <div>
      {listOfPosts.map((value, key) => {
        {
          console.log(value.UserId);
        }
        return (
          <div key={key} className="post">
            <div className="title">{value.title}</div>
            <div
              className="body"
              onClick={() => {
                navigate(`/post/${value.id}`);
              }}
            >
              {value.postText}
            </div>

            <div className="footer">
              <div className="username">
                <Link to={`/profile/${value.UserId}`}> {value.username} </Link>
              </div>

              <div className="buttons">
                <ThumbUpIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className={
                    // if its include the current (value.id) in this individual post id.
                    likedPosts.includes(value.id) ? "unlikeBttn" : "likeBttn"
                  }
                />
                {/* <ThumbUpIcon
                  onClick={() => {
                    likeAPost(value.id);
                  }}
                  className="unlikeBttn"
                /> */}

                {/* Showing how many like per post && and its rerendered from this code in above ---> return { ...post, Like: [...post.Likes, 0] };   */}
                <label>{value.Likes.length}</label>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
