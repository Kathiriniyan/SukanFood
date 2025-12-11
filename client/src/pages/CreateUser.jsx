import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const roles = [
    "admin",
    "sales",
    "warehouse",
    "backoffice",
    "monitor",
    "user",
    "reader",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-2">
        {/* Breadcrumbs and Page Title */}
        <nav className="text-sm text-gray-500 mb-2">
          <ol className="list-none flex gap-2">
            <li>
              <span
                className="cursor-pointer text-[#e92a29] hover:underline"
                onClick={() => navigate("/")}
              >
                Dashboard
              </span>
            </li>
            <li>/</li>
            <li>
              <span
                className="cursor-pointer text-[#e92a29] hover:underline"
                onClick={() => navigate("/user/user-list")}
              >
                User
              </span>
            </li>
            <li>/</li>
            <li className="text-gray-700">Create User</li>
          </ol>
        </nav>

        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          Create New User
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to create a new user account.
        </p>

        {/* Centered Form */}
        <div className="w-full flex justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-md w-full max-w-2xl"
          >
            {/* Email */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e92a29] focus:border-[#e92a29] outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{
                    WebkitTextSecurity: showPassword ? "none" : "disc",
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e92a29] focus:border-[#e92a29] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  style={{
                    WebkitTextSecurity: showConfirmPassword ? "none" : "disc",
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e92a29] focus:border-[#e92a29] outline-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div className="mb-5">
              <label className="block mb-2 font-medium text-gray-700">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#e92a29] focus:border-[#e92a29] outline-none"
              >
                <option value="">Select a Role</option>
                {roles.map((role, idx) => (
                  <option key={idx} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/user/user-list")}
                className="w-full sm:w-auto px-5 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-5 py-2 rounded-md bg-[#e92a29] text-white hover:bg-[#c42020] transition"
              >
                Create User
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateUser;
