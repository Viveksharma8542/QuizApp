// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Mock authentication - Replace with actual API call
    // In production, call your backend API here
    try {
      // Simulated API call
      const response = await mockLogin(email, password);
      
      if (response.success) {
        login(response.user);
        
        // Redirect based on role
        switch (response.user.role) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'teacher':
            navigate('/teacher/dashboard');
            break;
          case 'student':
            navigate('/student/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('An error occurred during login');
    }
  };

  // Mock login function - Replace with actual API
  const mockLogin = (email, password) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Demo users
        const users = [
          { email: 'admin@quiz.com', password: 'admin123', role: 'admin', name: 'Admin User', id: '1' },
          { email: 'teacher@quiz.com', password: 'teacher123', role: 'teacher', name: 'John Teacher', id: '2' },
          { email: 'student@quiz.com', password: 'student123', role: 'student', name: 'Jane Student', id: '3' }
        ];

        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password, ...userWithoutPassword } = user;
          resolve({ success: true, user: userWithoutPassword });
        } else {
          resolve({ success: false, message: 'Invalid email or password' });
        }
      }, 500);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-500 p-3 rounded-full">
            <LogIn className="text-white" size={32} />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Quiz Management System
        </h2>
        <p className="text-center text-gray-600 mb-6">Sign in to continue</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 font-semibold mb-2">Demo Credentials:</p>
          <p className="text-xs text-gray-500">Admin: admin@quiz.com / admin123</p>
          <p className="text-xs text-gray-500">Teacher: teacher@quiz.com / teacher123</p>
          <p className="text-xs text-gray-500">Student: student@quiz.com / student123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;