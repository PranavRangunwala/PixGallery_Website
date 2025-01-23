import React, { useState, useEffect } from 'react';
import { auth } from '../../config/firebase';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const ResetPass = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const user = auth.currentUser;
    if (!user) {
      // Redirect to login page if user is not logged in
      navigate('/login');
    }
  }, [navigate]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!currentPassword) {
      formErrors.currentPassword = 'Current password is required';
      isValid = false;
    }

    if (!newPassword) {
      formErrors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 6) {
      formErrors.newPassword = 'New password must be at least 6 characters long';
      isValid = false;
    }

    if (newPassword !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      const user = auth.currentUser;

      if (user) {
        try {
          // Reauthenticate the user
          const credential = EmailAuthProvider.credential(user.email, currentPassword);
          await reauthenticateWithCredential(user, credential);

          // Update the password
          await updatePassword(user, newPassword);
          setMessage('Password updated successfully');
          setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
        } catch (error) {
          if (error.code === 'auth/wrong-password') {
            setErrors({ currentPassword: 'Current password is incorrect' });
          } else {
            alert(error.message);
          }
        }
      } else {
        alert('No user is logged in');
      }
    }
  };

  return (
    <div className="dark text-white min-h-screen flex flex-col">
      <h1 className='p-4 flex justify-center text-4xl font-nunito my-4'>
        Reset Password
      </h1>

      <div className="flex justify-center mt-8 flex-grow">
        <div className='bg-gray-800 p-10 rounded-lg w-full max-w-md'>
          <form onSubmit={handlePasswordReset}>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="currentPassword">Current Password:</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
              {errors.currentPassword && <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="newPassword">New Password:</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
              {errors.newPassword && <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>}
            </div>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="w-full p-2 mt-4 bg-blue-600 rounded hover:bg-blue-700">Reset Password</button>
          </form>

          {message && (
            <p className="text-green-500 text-sm mt-4">{message}</p>
          )}
        </div>
      </div>

      <div className='relative mt-8'>
        <Footer />
      </div>
    </div>
  );
};

export default ResetPass;
