import React, { useState, useEffect } from "react";
import { Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";
const Register = () => {
  const img =
    "https://images.unsplash.com/photo-1554224311-beadea32c744?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  //from submit
  const submitHandler = async (values) => {
    try {
      setLoading(true);
      await axios.post("/users/register", values);
      message.success("Registration Successful");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("Something went wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  return (
    <>
      <div className="register-page">
        {loading && <Spinner />}
        <div className="row container">
          <h1>Personal Finance Tracker - MERN STACK</h1>
          <div className="col-md-6">
            <img src={img} alt="register-img" width={"100%"} height="100%" />
          </div>
          <div className="col-md-4 register-form">
            <Form layout="vertical" onFinish={submitHandler}>
              <h1>Register Form</h1>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter your name" },
                  { min: 2, message: "Name must be at least 2 characters" },
                ]}
              >
                <Input type="text" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email" },
                  {
                    type: "email",
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please enter your password" },
                  {
                    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
                    message:
                      "Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number",
                  },
                ]}
              >
                <Input type="password" />
              </Form.Item>
              <div className="d-flex justify-content-between">
                <Link to="/login">Already Register? login here!</Link>
                <button className="btn">Register</button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
