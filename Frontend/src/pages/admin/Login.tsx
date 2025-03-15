import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAdmin } from '../../redux/Adminslice';
import { AppDispatch } from '../../redux/store';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const AdminLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    email: 'Admin@gmail.com',
    password: 'Admin@123'
  });
  const [errors, setError] = useState({
    emailError: '',
    passwordError: ''
  });

  // Add regex patterns
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };

    if (name === "email") {
      newErrors.emailError = emailRegex.test(value)
        ? ""
        : "Enter a valid email";
    }
    if (name === "password") {
      newErrors.passwordError = passwordRegex.test(value)
        ? ""
        : "Password must contain at least 8 characters, one uppercase, one number and one special character";
    }

    setError(newErrors);
    setFormData({ ...formData, [name]: value });
  };
  const handleClick = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (
      errors.emailError ||
      errors.passwordError ||
      !formData.email ||
      !formData.password
    ) {
      toast.error("Enter valid data!");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/admin/login',
        formData,
        { withCredentials: true }
      );

      if (response.data.status === 'success') {
        console.log(response.data)
        dispatch(setAdmin({
          admin: response.data.admin,
          accessToken: response.data.accessToken
        }));

        toast.success('Admin Login successful!');
        navigate('/adminHome');
      }
    } catch (error: any) {
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
    }
  };

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-2xl w-96 flex flex-col items-center">
        <h6 className="font-bold text-2xl text-black mb-6">Admin Login</h6>

        <form onSubmit={handleClick} className="w-full flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 focus:outline-none focus:border-red-500"
            />
            <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.emailError}
            </small>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="border-2 rounded-lg p-2 focus:outline-none focus:border-red-500"
            />
            <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.passwordError}
            </small>
          </div>

          <button
            type="submit"
            className="bg-red-500 text-white py-2 rounded-lg mt-4 hover:bg-red-600 transition-colors"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
