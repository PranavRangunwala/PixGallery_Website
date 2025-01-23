import React, { useState } from 'react';
import { auth } from '../../config/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Link } from 'react-router-dom';
import Footer from './Footer';

const ResetPass = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
      <div className='bg-gray-800 p-10 rounded-lg w-full max-w-md'>
      <h2 className="text-3xl font-bold text-center text-white mb-6">Reset Your Password</h2>
        {message && <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4 text-center">{message}</div>}
        {error && <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 text-center">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-3 border border-gray-600 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
          >
            Reset Password
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-400 hover:underline text-sm">Back to Home</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
