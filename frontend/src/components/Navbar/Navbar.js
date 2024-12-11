import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
const Navbar = () => {
  const url = process.env.REACT_URL;
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    // Call getEmail whenever the route changes
    getEmail();
  }, [location.pathname]); // Dependency array includes pathname

  const getEmail = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const response = await axios.get(`${url}/getEmail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.email) {
        setEmail(response.data.email);
      } else {
        console.error("Email not found in response");
      }
    } catch (error) {
      console.error("Error fetching email:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      if (location.pathname !== "/login" || location.pathname !== "/signup") {
        navigate("/login");
        return;
      } else {
        getEmail();
      }
    }
  }, []);
  const LogOut = () => {
    setEmail("");
    localStorage.removeItem("token");
    navigate("/login");
  };
  return (
    <div
      style={{
        boxShadow: "0px 2px 2px grey",
        margin: "2px auto",
        padding: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <div
          style={{ fontSize: "20px", marginLeft: "20px" }}
          onClick={() => {
            navigate("/");
          }}
        >
          Task Management
        </div>
        <div style={{ display: "flex ", alignItems: "center" }}>
          <div style={{ fontSize: "20px", marginRight: "20px" }}>{email}</div>
          {email && (
            <button
              style={{
                backgroundColor: "black",
                color: "white",
                padding: "5px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={LogOut} // Pass the function reference here
            >
              Log out
            </button>
          )}
          {!email && (
            <div style={{ display: "flex" }}>
              <button
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "5px",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")} // Pass the function reference here
              >
                Login
              </button>
              <button
                style={{
                  backgroundColor: "black",
                  color: "white",
                  padding: "5px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  marginLeft: "5px",
                }}
                onClick={() => navigate("/signup")} // Pass the function reference here
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
