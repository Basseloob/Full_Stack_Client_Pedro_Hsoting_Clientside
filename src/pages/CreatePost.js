import React, { useContext, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";

const CreatePost = () => {
  let navigate = useNavigate();
  const { authState } = useContext(AuthContext);

  const initialValues = {
    title: "",
    postText: "",
    // username: "",
  };

  const onSubmit = (data) => {
    // after the link need to put the BODY called data !!!!
    axios
      .post("http://localhost:3001/posts", data, {
        // getting the user token data from the Posts.js validate token.
        headers: { accessToken: localStorage.getItem("accessToken") },
      })
      .then((response) => {
        // console.log(response);
        //   console.log(data);
        console.log("Data has been Posted.");
        navigate("/");
        // setListOfPosts(response.data);
      });
  };

  useEffect(() => {
    // if (!authState.status) {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
    }
  }, []);

  // we did this in the DB - But this is considered double layer of protection.
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("You must enter a Title!"),
    postText: Yup.string().required(),
    // username: Yup.string().min(3).max(15).required(),
  });

  return (
    <div className="createPostPage">
      {/* // initialValues={is the inistial value of the fields} onSubmit={} validationSchema={}
       */}
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <label>Title : </label>
          {/* Displaying the Errors in between the input field & Label */}
          <ErrorMessage name="title" component="span" />
          {/* name is the filed that been used in the DB. */}
          <Field
            id="inputCreatePost"
            name="title"
            placeholder="(Ex. Title...)"
          />
          <label>Post : </label>
          {/* Displaying the Errors in between the input field & Label */}
          <ErrorMessage name="postText" component="span" />
          <Field
            id="inputCreatePost"
            name="postText"
            placeholder="(Ex. Post...)"
          />{" "}
          <label>Username : </label>
          {/* Displaying the Errors in between the input field & Label */}
          {/* <ErrorMessage name="username" component="span" />
          <Field
            id="inputCreatePost"
            name="username"
            placeholder="(Ex. Basil...)"
          /> */}
          {/* submit --> automatically will till the from to submit. */}
          <button type="submit">Create Post</button>
        </Form>
      </Formik>
    </div>
  );
};

export default CreatePost;
