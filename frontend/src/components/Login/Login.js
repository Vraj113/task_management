import React, { useState } from "react";
import styles from "./Login.module.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Login = () => {
  let url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onSubmit = async () => {
    if (data.email === "" || data.password === "") {
      toast("Please Fill all the details");
      return;
    }
    try {
      const res = await axios.post(`${url}/login`, data);
      console.log(res);
      if (res.status === 201) {
        localStorage.setItem("token", res.data.token);
        navigate("/");
      } else {
        toast("Something went wrong");
      }
    } catch (error) {
      console.error("Error response:", error.response);
      if (error.response && error.response.status === 400) {
        toast("Username or password is incorrect");
      } else {
        toast("Something went wrong. Please try again later.");
      }
    }
  };
  return (
    <div className={styles.main}>
      <ToastContainer />
      <div className={styles.semimain}>
        <div>
          <div>Enter your Email</div>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={data.email}
            onChange={onChange}
          />
        </div>
        <div>
          <div>Enter your Password</div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={data.password}
            onChange={onChange}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button onClick={onSubmit} className={styles.logoinButton}>
            Login
          </button>
        </div>
        <div className={styles.or}>or</div>
        <div>
          <button className={styles.signupButton}>Click here to Signup</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
