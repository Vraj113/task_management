import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const AddTask = () => {
  let url = process.env.REACT_APP_URL;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    token: token,
  });
  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    console.log(data);
  };
  const onSubmit = async () => {
    const res = await axios.post(`${url}/addTask`, data);
    if (res.status === 201) {
      console.log(res);
      navigate("/");
    }
  };
  return (
    <div>
      <div>
        <div>Title</div>
        <input
          type="text"
          value={data.title}
          name="title"
          onChange={onChange}
        />
      </div>
      <div>
        <div>Description</div>
        <input
          type="text"
          value={data.description}
          name="description"
          onChange={onChange}
        />
      </div>
      {/* <div>
        <div>Status</div>
        <input
          type="text"
          value={data.status}
          name="status"
          onChange={onChange}
        />
      </div> */}
      <div>
        <div>Assigned to</div>
        <input
          type="text"
          value={data.assignedTo}
          name="assignedTo"
          onChange={onChange}
        />
      </div>
      <div>
        <button onClick={onSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default AddTask;
