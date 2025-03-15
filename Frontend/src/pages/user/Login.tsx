import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import {setUser} from '../../redux/Authslice'
import { AppDispatch } from '../../redux/store';

  const Login = () => {
    const dispatch = useDispatch<AppDispatch>();

    const navigate = useNavigate()
    const [formData,setFormData] = useState({
      email:'abin@gmail.com',
      password:'Abin@2006'
    })
      const [errors, setError] = useState({
        emailError: "",
        passwordError: "",
      });
      const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const passwordRegex: RegExp =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
      const { name, value } = e.target;
      console.log(e.target)
      const newErrors = { ...errors };
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
    }
    const handleClick = (e:React.FormEvent)=>{
      e.preventDefault()
      if (
            errors.emailError ||
            errors.passwordError ||
            !formData.email ||
            !formData.password
          ) {
            toast.error("Enter valid data!");
            return;
          }

      axios.post("http://localhost:3000/login", formData, { withCredentials: true })
        .then(response => {
          const userData = {
            ...response.data.user,
            image: response.data.user.image 
              ? `http://localhost:3000/uploads/${response.data.user.image.split('\\').pop()}`
              : null
          };
          
          dispatch(setUser({ 
            user: userData, 
            accessToken: response.data.accessToken 
          }));
          
          navigate('/');
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
          console.error("Error logging in", error);
        });
    }

    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
              <ToastContainer position="top-right" autoClose={3000} />
        <div className="bg-white p-8 rounded-2xl w-96 flex flex-col items-center">
          <h6 className="font-bold text-2xl text-black mb-6">Login</h6>
  
          <form className="w-full flex flex-col gap-4" onSubmit={handleClick}>
  
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">
                Email
              </label>
              <input onChange={handleChange}
              name="email"
              value={formData.email}
                type="email"
                id="email"
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
              onChange={handleChange}
              value={formData.password}
                type="password"
                id="password"
                name="password"
                className="border-2 rounded-lg p-2 focus:outline-none focus:border-red-500"
              />
               <small className="text-red-500 text-xs h-3 mt-0.5">
              {errors.passwordError}
            </small>
            </div>
            <span>Dont have Account ? <a className="cursor-pointer text-blue-500 font-bold" onClick={()=>navigate('/signup')}> signup</a></span>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 rounded-lg mt-4 hover:bg-blue-600 transition-colors"
            >
              Login 
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default Login;