import React from 'react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useState } from 'react';

import logo from '../../assets/images/logo.png';
import loginDesktop from '../../assets/images/login3.png';
import loginMobile from '../../assets/images/login-mobile.png';
import bg1 from '../../assets/images/bg1.png'; // Import your background image
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '', remember: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
    console.log('Logging in with:', form);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center before:absolute before:inset-0 before:bg-black/30 before:backdrop-blur-xs"
        style={{ backgroundImage: `url(${bg1})` }}
      ></div>

      {/* Overlay for Glass Effect */}
      <div className="relative z-10 flex w-full max-w-5xl bg-white backdrop-blur-lg shadow-xl rounded-2xl overflow-hidden">
        {/* Left Image Panel (hidden on mobile) */}
        <div className="hidden md:block md:w-1/2">
          <img
            src={loginDesktop}
            alt="Login visual"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 relative">
          {/* Mobile Image */}
          <div className="md:hidden mb-6">
            <img
              src={loginMobile}
              alt="Login visual mobile"
              className="w-full h-48 object-contain"
            />
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">Login to your account</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="text-sm text-gray-700">Username</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white mt-1">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className="w-full outline-none text-sm text-gray-700 bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-700">Password</label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2 bg-white mt-1">
                <FaLock className="text-gray-400 mr-2" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full outline-none text-sm text-gray-700 bg-transparent"
                  required
                />
              </div>
            </div>

            {/* Remember & Terms */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="accent-[#e92a29]"
                />
                Remember me
              </label>
              <a
                href="/terms"
                className="text-[#e92a29] font-medium hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms & Conditions
              </a>
            </div>

            <button
              type="submit"
              onClick={() => navigate("/")}
              className="w-full bg-[#e92a29] hover:bg-[#d81e1e] text-white py-2 rounded-md transition-all font-semibold"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
