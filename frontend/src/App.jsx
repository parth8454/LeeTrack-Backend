import { useEffect, useState } from 'react'
import './App.css'
import Login from './Pages/AuthPages/Login'
import Signup from './Pages/AuthPages/Signup'
import ForgotPass from './Pages/AuthPages/ForgotPass'
import ResetPass from './Pages/AuthPages/ResetPass'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Home from './Pages/HomePages/Home'
import Otpverify from './Pages/AuthPages/Otpverify'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import ResetPassOTP from './Pages/AuthPages/ResetPassOTP'
import Profile from './Pages/HomePages/Profile'
import About from './Pages/HomePages/About'
import SenseiChat from './Pages/HomePages/chat'
import Leaderboard from './Pages/HomePages/Leaderboard'

function App() {


  const PrivateRoute = ({children}) =>{
    
    const token = localStorage.getItem('token')

    return token ? children : <Navigate to="/login" />;
  };

  return (
    <>
    <Routes>
      <Route path='/' element={<Navigate to="/login"/>}/>

      <Route path="/login" element={<Login/>}/>
      <Route path="/Signup" element={<Signup/>}/>
      <Route path="/chat" element={<SenseiChat/>}/>
      <Route path='/Signup/verifyOTP' element={<Otpverify/>}/>
      <Route path="/login/forgot_pass" element={<ForgotPass/>}/>
      <Route path='/login/forgot_pass/ResetPassOTP' element={<ResetPassOTP/>}/>
      <Route path="/login/reset_pass" element={<ResetPass/>}/>
      <Route path="/home" element={<PrivateRoute> <Home /> </PrivateRoute>} />
      <Route path="/home/leaderboard" element={<PrivateRoute> <Leaderboard /> </PrivateRoute>} />
      <Route path="/home/sensei" element={<PrivateRoute> <SenseiChat /> </PrivateRoute>} />
      <Route path="/home/profile" element={<PrivateRoute> <Profile /> </PrivateRoute>} />
      <Route path="/home/About" element={<PrivateRoute><About/></PrivateRoute>}/>

      
      </Routes>
    
    <ToastContainer limit={1} />
      
    </>
  )
}

export default App
