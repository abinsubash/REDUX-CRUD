import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { MdEdit } from "react-icons/md";
import axios from 'axios';
import { toast } from 'react-toastify';
import { RootState } from '../../redux/store';
import { logoutAdmin } from '../../redux/Adminslice';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash } from 'react-icons/fa';

interface User {
  _id: string;
  name: string;
  age: number;
  email: string;
  isBlocked: boolean;
}

interface NewUser {
  name: string;
  email: string;
  age: string;
  password: string;
}

interface EditUser {
  id: string;
  name: string;
  age: string;
}

const AdminHome = () => {
  const [users, setUsers] = useState<User[]>([]);
  const admin = useSelector((state: RootState) => state.admin);
  const { accessToken } = admin;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string>('');
  const [editingUser, setEditingUser] = useState<EditUser | null>(null);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    age: '',
    password: ''
  });

  const [errors, setErrors] = useState({
    nameError: '',
    emailError: '',
    ageError: '',
    passwordError: ''
  });

  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex: RegExp = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
  const nameRegex: RegExp = /^[a-zA-Z\s]{2,30}$/;

  useEffect(() => {
    if(accessToken){
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching users...');
      const response = await axios.get('http://localhost:3000/admin/getUsers', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
  
      setUsers(response.data.users); 
      console.log(response.data);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Failed to fetch users');
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      nameError: '',
      emailError: '',
      ageError: '',
      passwordError: ''
    };
  
    // Validate name
    if (!nameRegex.test(newUser.name)) {
      newErrors.nameError = 'Name should be 2-30 characters long and contain only letters';
      isValid = false;
    }
  
    // Validate email
    if (!emailRegex.test(newUser.email)) {
      newErrors.emailError = 'Please enter a valid email address';
      isValid = false;
    }
  
    // Validate age
    const age = Number(newUser.age);
    if (isNaN(age) || age < 18 || age > 100) {
      newErrors.ageError = 'Age must be between 18 and 100';
      isValid = false;
    }
  
    // Validate password
    if (!passwordRegex.test(newUser.password)) {
      newErrors.passwordError = 'Password must contain at least 8 characters, one uppercase, one number and one special character';
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  const handleLogout = () => {
    dispatch(logoutAdmin());
    navigate('/adminLogin');
  };

  const handleAddUser = async () => {
    if (!validateForm()) {
        toast.error('Please fix the form errors');
        return;
    }

    try {
        const response = await axios.post(
            'http://localhost:3000/admin/createUser',
            newUser,
            {
                headers: { Authorization: `Bearer ${accessToken}` }
            }
        );

        if (response.data.status === 'success') {
            toast.success('User added successfully');
            setShowAddModal(false);
            setNewUser({ name: '', email: '', age: '', password: '' });
            setErrors({ nameError: '', emailError: '', ageError: '', passwordError: '' });
            fetchUsers();
        }
    } catch (error: any) {
        // Check if error message is about existing email
        if (error.response?.data?.message === 'Email already exists') {
            setErrors(prev => ({
                ...prev,
                emailError: 'Email already exists'
            }));
        } else {
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    }
};

  const handleEdit = (user: User) => {
    setEditingUser({
      id: user._id,
      name: user.name,
      age: user.age.toString()
    });
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    try {
      console.log(editingUser)
      const response = await axios.patch(
        `http://localhost:3000/admin/editUser/${editingUser.id}`,
        { name: editingUser.name, age: Number(editingUser.age) },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      console.log(response.data)
      if (response.data.status === 'success') {
        toast.success('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/admin/deleteUser/${deleteUserId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      if (response.data.status === 'success') {
        toast.success('User deleted successfully');
        setShowDeleteModal(false);
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className='w-full min-h-screen bg-black p-8'>
      <div className='flex justify-between items-center mb-8'>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Add User
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>

      <table className="border-collapse table-auto w-full">
        <thead>
          <tr className="border-b border-white">
            <th className="border border-white px-4 py-2 text-white">Name</th>
            <th className="border border-white px-4 py-2 text-white">Age</th>
            <th className="border border-white px-4 py-2 text-white">Email</th>
            <th className="border border-white px-4 py-2 text-white">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b border-white">
              <td className="border border-white px-4 py-2 text-white">
                {editingUser?.id === user._id ? (
                  <input
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="bg-gray-800 text-white px-2 py-1 rounded"
                  />
                ) : user.name}
              </td>
              <td className="border border-white px-4 py-2 text-white">
                {editingUser?.id === user._id ? (
                  <input
                    type="number"
                    value={editingUser.age}
                    onChange={(e) => setEditingUser({...editingUser, age: e.target.value})}
                    className="bg-gray-800 text-white px-2 py-1 rounded w-20"
                  />
                ) : user.age}
              </td>
              <td className="border border-white px-4 py-2 text-white">{user.email}</td>
              <td className="border border-white px-4 py-2 text-white">
                <div className='flex flex-row gap-5 justify-center'>
                  {editingUser?.id === user._id ? (
                    <button
                      onClick={handleSaveEdit}
                      className="text-green-500 hover:text-green-400"
                    >
                      Save
                    </button>
                  ) : (
                    <MdEdit
                      className="cursor-pointer hover:text-blue-500 text-xl"
                      onClick={() => handleEdit(user)}
                    />
                  )}
                  <FaTrash
                    className="cursor-pointer hover:text-red-500 text-xl"
                    onClick={() => {
                      setDeleteUserId(user._id);
                      setShowDeleteModal(true);
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New User</h2>
            
            <div className="mb-4">
              <input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                className={`w-full p-2 border rounded ${errors.nameError ? 'border-red-500' : ''}`}
              />
              {errors.nameError && (
                <small className="text-red-500 text-xs mt-1">{errors.nameError}</small>
              )}
            </div>
      
            <div className="mb-4">
              <input
                placeholder="Email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                className={`w-full p-2 border rounded ${errors.emailError ? 'border-red-500' : ''}`}
              />
              {errors.emailError && (
                <small className="text-red-500 text-xs mt-1">{errors.emailError}</small>
              )}
            </div>
      
            <div className="mb-4">
              <input
                placeholder="Age"
                type="number"
                value={newUser.age}
                onChange={(e) => setNewUser({...newUser, age: e.target.value})}
                className={`w-full p-2 border rounded ${errors.ageError ? 'border-red-500' : ''}`}
              />
              {errors.ageError && (
                <small className="text-red-500 text-xs mt-1">{errors.ageError}</small>
              )}
            </div>
      
            <div className="mb-4">
              <input
                placeholder="Password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                className={`w-full p-2 border rounded ${errors.passwordError ? 'border-red-500' : ''}`}
              />
              {errors.passwordError && (
                <small className="text-red-500 text-xs mt-1">{errors.passwordError}</small>
              )}
            </div>
      
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewUser({ name: '', email: '', age: '', password: '' });
                  setErrors({ nameError: '', emailError: '', ageError: '', passwordError: '' });
                }}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black flex items-center justify-center backdrop:brightness-75">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminHome
