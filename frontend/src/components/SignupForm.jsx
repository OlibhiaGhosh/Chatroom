import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignupForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/signup",
        formData
      );
      console.log(response.data);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="w-[400px] border border-green-800 bg-gray-900 text-white rounded-lg">
        <div className="p-6 pb-2">
          <h2 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Create an Account
          </h2>
          <p className="text-center text-gray-400 mt-2">
            Sign up to start creating chatrooms
          </p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label
                  htmlFor="username"
                  className="text-white text-sm font-medium"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  placeholder="johndoe"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="email"
                  className="text-white text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="password"
                  className="text-white text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="confirmPassword"
                  className="text-white text-sm font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="firstName"
                    className="text-white text-sm font-medium"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="lastName"
                    className="text-white text-sm font-medium"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Sign Up"}
              </button>
              {error && (
                <div className="text-red-500 text-sm mt-2">{error}</div>
              )}
            </div>
          </form>
        </div>
        <div className="p-6 pt-0 flex flex-col gap-4">
          <div className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-400 hover:text-blue-300"
            >
              Login
            </button>
          </div>
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-gray-300 text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default SignupForm;
