import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
import Login from './pages/user/Login'
import Signup from './pages/user/Signup'
import Home from './pages/user/Home'
import AdminLogin from './pages/admin/Login'
import AdminHome from './pages/admin/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './routes/user/protectedRoute'
import { AuthProtectedRoute } from './routes/user/authProtectedRoute'
import { AdminProtectedRoute } from './routes/admin/AdminProtectedRoute'
import { AdminAuthProtectedRoute } from './routes/admin/AdminAuthProtectedRoute'

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <Routes>
            <Route path='/adminHome' element={
              <AdminProtectedRoute>
                <AdminHome/>
              </AdminProtectedRoute>
            }/>
            <Route path='/' element={
              <ProtectedRoute>
                <Home/>
              </ProtectedRoute>
            }/>
            <Route path='/login' element={
              <AuthProtectedRoute>
                <Login/>
              </AuthProtectedRoute>
            }/>
            <Route path='/signup' element={
              <AuthProtectedRoute>
                <Signup/>
              </AuthProtectedRoute>
            }/>
            <Route path='/adminLogin' element={
              <AdminAuthProtectedRoute>
                <AdminLogin/>
              </AdminAuthProtectedRoute>
            }/>
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  )
}

export default App
