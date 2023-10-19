import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../helpers/AuthContext";

const Post = () => {
  // exactly the id in "/post/:id" :
  let { id } = useParams();
  const [postObject, setPostObject] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  let navigate = useNavigate();

  // Grabbing the setAuthState from AuthContext...
  // we can now from this know which user is logged in by grabbing this authState usn it in the Delete Button.
  const { authState } = useContext(AuthContext);

  useEffect(() => {
    // Getting the POST :
    axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
      setPostObject(response.data);
    });
    // Getting the COMMENT :
    axios.get(`http://localhost:3001/comments/${id}`).then((response) => {
      setComments(response.data);
    });
  }, []);

  const addComment = () => {
    axios
      .post(
        "http://localhost:3001/comments",
        {
          // setNewComment(event.target.value);
          commentBody: newComment,
          //  The id from the params : let { id } = useParams();
          PostId: id,
        },
        {
          headers: {
            // accessToken from the authMiddleware.js :
            // accessToken: sessionStorage.getItem("accessToken"),
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        if (response.data.error) {
          console.log("There is something wrong !");
          alert(response.data.error);
        } else {
          console.log("Comment added!");
          const commentToAdd = {
            commentBody: newComment,
            username: response.data.username,
          };
          setComments([...comments, commentToAdd]); // means get the previous comments and add to to them the new comment into the DB.
          setNewComment(""); // clearing the input field.
        }
      });
  };

  const deleteComment = (id) => {
    axios
      .delete(`http://localhost:3001/comments/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        setComments(
          comments.filter((val) => {
            // only keep the comment that has the val.id if its not equal the id passed in the main function parameter.
            return val.id != id;
          })
        );
      });
  };

  const deletePost = (id) => {
    axios
      .delete(`http://localhost:3001/posts/${id}`, {
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then(() => {
        // alert("delete success");
        navigate("/");
      });
  };

  const editPost = (option) => {
    if (option === "title") {
      // Prompt :
      let newTitle = prompt("Enter new title: ");
      axios.put(
        `http://localhost:3001/posts/title`,
        {
          newTitle: newTitle,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      // Keep Everything in the postObject is the dame - But change the title :
      setPostObject({ ...postObject, title: newTitle });
    } else {
      let newPostText = prompt("Enter new Text : ");
      axios.put(
        `http://localhost:3001/posts/postText`,
        {
          newText: newPostText,
          id: id,
        },
        {
          headers: {
            accessToken: localStorage.getItem("accessToken"),
          },
        }
      );

      // Keep Everything in the postObject is the dame - But change the title :
      setPostObject({ ...postObject, postText: newPostText });
    }
  };

  return (
    <div className="postPage">
      {/* Left Side */}
      <div className="leftSide">
        <div className="post" id="individual">
          <div
            className="title"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("title");
              }
            }}
          >
            {postObject.title}
          </div>
          <div
            className="body"
            onClick={() => {
              if (authState.username === postObject.username) {
                editPost("body");
              }
            }}
          >
            {postObject.postText}
          </div>
          <div className="footer">
            {postObject.username}

            {authState.username === postObject.username && (
              <button
                onClick={() => {
                  deletePost(postObject.id);
                }}
              >
                Delete Post
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="rightSide">
        <div className="addCommentContainer">
          <input
            type="text"
            placeholder="comment..."
            autoComplete="off"
            value={newComment}
            // Grabbing the inputted value :
            onChange={(event) => {
              setNewComment(event.target.value);
            }}
          ></input>
          <button onClick={addComment}>Add Comment </button>
        </div>
        <div className="listOfComments">
          {comments.map((comment, key) => {
            return (
              <div key={key} className="comment">
                {comment.commentBody}

                {/* Displaying the username for the comment */}
                <div>Username : {comment.username}</div>

                {/* Delete Button : display the button if it equals the comments username. */}
                {authState.username === comment.username && (
                  <button
                    onClick={() => {
                      deleteComment(comment.id);
                    }}
                  >
                    X
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Post;
