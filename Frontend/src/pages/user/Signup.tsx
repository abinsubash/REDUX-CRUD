import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    password: "",
  });
  const [errors, setError] = useState({
    nameError: "",
    ageError: "",
    emailError: "",
    passwordError: "",
  });
  const nameRegex: RegExp = /^[a-zA-Z\s]+$/;
  const ageRegex: RegExp = /^\d+$/;
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex: RegExp =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const newErrors = { ...errors };

    if (name === "name") {
      newErrors.nameError = nameRegex.test(value) ? "" : "Enter a valid name";
    }
    if (name === "age") {
      newErrors.ageError = ageRegex.test(value) ? "" : "Enter a valid age";
    }
    if (name === "email") {
      newErrors.emailError = emailRegex.test(value)
        ? ""
        : "Enter a valid email";
    }
    if (name === "password") {
      newErrors.passwordError = passwordRegex.test(value)
        ? ""
        : "Enter a valid password";
    }

    setError(newErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (
      errors.ageError ||
      errors.emailError ||
      errors.passwordError ||
      errors.nameError ||
      !formData.age ||
      !formData.email ||
      !formData.name ||
      !formData.password
    ) {
      toast.error("Enter valid data!");
      return;
    }
    
    axios.post('http://localhost:3000/signup', formData)
    .then(response => {
        console.log("Signup successful", response.data);
        navigate('/login')
    })
    .catch(error => {
      const errorMessage = error.response?.data?.message || "Something went wrong!";
    
      toast.error(`❌ ${errorMessage}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
      });
  
      console.error("Error signing up", error);
    });

  };

  return (
    <div className="w-full min-h-[60vh] bg-black flex justify-center items-center h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-4 rounded-lg w-80 flex flex-col items-center shadow-lg">
        <h6 className="font-bold text-lg text-black mb-3">SignUp</h6>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-2">
          <div className="flex flex-col mb-2">
            <label htmlFor="name" className="font-medium text-sm mb-1">
              Name
            </label>
            <input
              onChange={handleChange}
              value={formData.name}
              type="text"
              id="name"
              name="name"
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.nameError}
            </small>
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="age" className="font-medium text-sm mb-1">
              Age
            </label>
            <input
              onChange={handleChange}
              value={formData.age}
              type="number"
              id="age"
              name="age"
              min="5"
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.ageError}
            </small>
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="email" className="font-medium text-sm mb-1">
              Email
            </label>
            <input
              onChange={handleChange}
              value={formData.email}
              type="email"
              name="email"
              id="email"
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.emailError}
            </small>
          </div>

          <div className="flex flex-col mb-2">
            <label htmlFor="password" className="font-medium text-sm mb-1">
              Password
            </label>
            <input
              onChange={handleChange}
              value={formData.password}
              type="password"
              id="password"
              name="password"
              className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
            />
            <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.passwordError}
            </small>
          </div>
        <span >already have an account ? <a className="cursor-pointer text-blue-500 font-bold" onClick={()=>navigate('/login')}> Login</a></span>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md mt-1 hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
