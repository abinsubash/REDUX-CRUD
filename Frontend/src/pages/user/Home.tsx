import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../redux/store";
import axios from "axios";
import { logout, setUser, updateUser } from "../../redux/Authslice";
import { toast } from "react-toastify";
import { MdEdit } from "react-icons/md";
import { FaPen } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    name: user?.name || "",
    age: user?.age || "",
  });

  useEffect(() => {
    if (user) {
      setEditedData({
        name: user.name || "",
        age: user.age || "",
      });
    }
  }, [user]);


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedImage(file);

      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "http://localhost:3000/uploadProfilePic",
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.data.status === 'success') {
          dispatch(updateUser(response.data.user));
          toast.success("Profile picture uploaded successfully!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to upload profile picture.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (!accessToken) {
        toast.error("Not authorized. Please login again.");
        return;
      }

      const response = await axios.patch(
        "http://localhost:3000/updateProfile",
        editedData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.data.status === "success") {
        dispatch(
          setUser({
            user: response.data.user,
            accessToken: response.headers.authorization || accessToken,
          })
        );

        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    toast.success('Logged out successfully!');
  };

  if (!user || !accessToken) {
    return null;
  }

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <div className="w-[500px] min-h-[400px] bg-white rounded-2xl flex flex-col gap-6 justify-start items-center relative p-10">
        <button
          onClick={handleLogout}
          className="absolute left-6 top-6 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
        >
          Logout
        </button>

        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden relative">
            {user?.image ? (
              <img 
                src={user.image} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-2xl font-bold">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </div>
          <label
            htmlFor="imageUpload"
            className="absolute bottom-1 right-1 bg-blue-500 p-2.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
          >
            <FaPen className="text-white text-sm" />
            <input
              type="file"
              id="imageUpload"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
        </div>

        {/* Toggle Edit Mode Button */}
        {isEditing ? (
          <RxCross2
            className="absolute right-6 top-6 cursor-pointer text-xl hover:text-blue-500"
            onClick={() => setIsEditing(false)}
          />
        ) : (
          <MdEdit
            className="absolute right-6 top-6 cursor-pointer text-xl hover:text-blue-500"
            onClick={() => setIsEditing(true)}
          />
        )}

        {/* User Details Section */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between">
            <span className="font-semibold">Name:</span>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedData.name}
                onChange={handleChange}
                className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              />
            ) : (
              <span className="text-gray-700">{user?.name || "N/A"}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Age:</span>
            {isEditing ? (
              <input
                type="number"
                name="age"
                value={editedData.age}
                onChange={handleChange}
                className="border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
              />
            ) : (
              <span className="text-gray-700">{user?.age || "N/A"}</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <span className="font-semibold">Email:</span>
            <span className="text-gray-700">{user?.email || "N/A"}</span>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            onClick={handleSave}
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
