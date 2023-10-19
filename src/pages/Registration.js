import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const Registration = () => {
  const initialValues = {
    username: "",
    password: "",
  };

  // we did this in the DB - But this is considered double layer of protection.
  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(15).required(),
    password: Yup.string().min(4).max(20).required(),
  });

  // the data here is the inputde username & password :
  const onSubmit = (data) => {
    //      The data object here is the req.body in the POSTMAN :
    axios.post("http://localhost:3001/auth", data).then(() => {
      console.log("The registered user is : ", data);
    });
  };

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
          <label>Username : </label>
          {/* Displaying the Errors in between the input field & Label */}
          <ErrorMessage name="username" component="span" />
          <Field
            // id="inputCreatePost"
            name="username"
            placeholder="(Ex. Basil...)"
          />

          <label>Password : </label>
          {/* Displaying the Errors in between the input field & Label */}
          <ErrorMessage name="password" component="span" />
          <Field
            // autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />
          {/* submit --> automatically will till the from to submit. */}
          <button type="submit">Register</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Registration;
