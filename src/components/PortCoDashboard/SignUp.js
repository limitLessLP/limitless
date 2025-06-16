import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const SignUp = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    signup_code: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [portcoInfo, setPortcoInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPortcoInfo = async () => {
      const id = searchParams.get('portcoId');
      localStorage.setItem('portco_id', id);
      if (id) {
        setLoading(true);
        try {
          const response = await fetch('https://limitless-backend.vercel.app/api/get-portco-info', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ portco_id: searchParams.get('portcoId') }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch PortCo information');
          }

          const data = await response.json();
          setPortcoInfo(data.portco);
        } catch (err) {
          setError('Failed to fetch PortCo information. Please try again.');
          console.error('Error fetching PortCo info:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPortcoInfo();
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://limitless-backend.vercel.app/api/portco-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          portco_id: searchParams.get('portcoId')
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create account');
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem('portco_user_id', data.id);
        navigate('/portco-dashboard');
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error('Error during signup:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Sign Up Form */}
      <div className="w-1/2 flex flex-col justify-center py-12 px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <h2 className="text-3xl font-extralight text-neutral-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Already have an account?{' '}
            <Link to="/portco-signin" className="font-medium text-neutral-900 hover:text-neutral-700">
              Sign in
            </Link>
          </p>
        </motion.div>

        <div className="mt-8 w-full max-w-md mx-auto">
          <div className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10 border border-neutral-200">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-neutral-700">
                    First Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="first_name"
                      name="first_name"
                      type="text"
                      required
                      value={formData.first_name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-neutral-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="last_name"
                      name="last_name"
                      type="text"
                      required
                      value={formData.last_name}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="signup_code" className="block text-sm font-medium text-neutral-700">
                  Signup Code
                </label>
                <div className="mt-1">
                  <input
                    id="signup_code"
                    name="signup_code"
                    type="text"
                    required
                    value={formData.signup_code}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm placeholder-neutral-400 focus:outline-none focus:ring-neutral-500 focus:border-neutral-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-500"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Welcome Section */}
      <div className="w-1/2 bg-gradient-to-br from-neutral-900 to-neutral-800 flex items-center justify-center p-12">
        {loading ? (
          <div className="text-white text-center">
            <p className="text-xl">Loading company information...</p>
          </div>
        ) : portcoInfo ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white max-w-lg"
          >
            <h1 className="text-4xl font-light mb-6">Welcome {portcoInfo.name}</h1>
            <p className="text-lg text-neutral-300 mb-8">{portcoInfo.description}</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {portcoInfo.category.map((cat, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-neutral-700 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              {portcoInfo.website && (
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Website</h3>
                  <a
                    href={`https://${portcoInfo.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-300 hover:text-white transition-colors"
                  >
                    {portcoInfo.website}
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="text-white text-center">
            <p className="text-xl">No company information available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp; 