import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'user-123',
          email: formData.email,
          username: formData.email.split('@')[0],
        })
      );
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="w-[400px] border border-green-800 bg-gray-900 text-white rounded-lg">
        <div className="p-6 pb-2">
          <h2 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Welcome Back
          </h2>
          <p className="text-center text-gray-400 mt-2">Login to access your chatrooms</p>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <label htmlFor="email" className="text-white text-sm font-medium">
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
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-white text-sm font-medium">
                    Password
                  </label>
                  <button type="button" className="text-sm text-blue-400 hover:text-blue-300">
                    Forgot password?
                  </button>
                </div>
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
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
        <div className="p-6 pt-0 flex flex-col gap-4">
          <div className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => navigate('/signup')} className="text-blue-400 hover:text-blue-300">
              Sign up
            </button>
          </div>
          <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-300 text-sm">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;