import React, { useState } from "react";
import styles from "./Signup.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  let url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    password: "",
    repeatPassword: "",
  });
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const onSubmit = async () => {
    console.log(url);
    if (
      data.email === "" ||
      data.password === "" ||
      data.repeatPassword === ""
    ) {
      toast("Please Fill all the details");
      return;
    } else if (data.password !== data.repeatPassword) {
      toast("Password Doesn't match");
      return;
    }
    try {
      const res = await axios.post(`${url}/signup`, data);
      if (res.status === 201) {
        console.log(res);
        localStorage.setItem("token", res.data.token);
        navigate("/");
      }
    } catch (error) {
      toast("Something went wrong ");
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
        <div>
          <div>Confirm your Password</div>
          <input
            type="password"
            placeholder="Password"
            name="repeatPassword"
            value={data.repeatPassword}
            onChange={onChange}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button className={styles.signupButton} onClick={onSubmit}>
            Signup
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
