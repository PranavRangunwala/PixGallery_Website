import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const Login = () => {
  const [showLoggedInMessage, setShowLoggedInMessage] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [redirect, setRedirect] = useState(false);
  const [emailNotVerified, setEmailNotVerified] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false); // New state for forgot password
  const [resetPasswordEmail, setResetPasswordEmail] = useState(''); // Email for password reset
  const [resetPasswordError, setResetPasswordError] = useState(''); // Error message for password reset
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(''); // Success message for password reset
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        navigate('/');
      } else if (user) {
        setEmailNotVerified(true);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (redirect) {
      const redirectTimeout = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(redirectTimeout);
    }
  }, [redirect, navigate]);

  const googleauth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      await signInWithPopup(auth, provider);
      setShowLoggedInMessage(true);
      setRedirect(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const emailPasswordLogin = async (event) => {
    event.preventDefault();

    setEmailError('');
    setPasswordError('');
    setEmailNotVerified(false);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        setShowLoggedInMessage(true);
        setRedirect(true);
      } else {
        setEmailNotVerified(true);
        await signOut(auth);
      }
    } catch (error) {
      if (error.code === 'auth/wrong-password') {
        setPasswordError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/user-not-found') {
        setEmailError('No account found with this email.');
      } else {
        alert(error.message);
      }
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setResetPasswordError('');
    setResetPasswordSuccess('');

    try {
      await sendPasswordResetEmail(auth, resetPasswordEmail);
      setResetPasswordSuccess('A password reset email has been sent.');
    } catch (error) {
      setResetPasswordError('Error sending password reset email. Please try again.');
    }
  };

  return (
    <>
      <body className="dark text-white">
        <h1 className='p-4 flex justify-center text-4xl font-nunito my-4'>
          
        </h1>
        {showLoggedInMessage && (
          <h1 className='p-4 flex justify-center text-4xl font-nunito my-4' id='loggedin'>
            Logged in successfully
          </h1>
        )}
        {emailNotVerified && (
          <h1 className='p-4 flex justify-center text-2xl font-nunito my-4 text-red-500'>
            Please verify your email before logging in.
          </h1>
        )}
        
        {!showForgotPassword ? (
          <div className="flex flex-col items-center mt-8">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
              <form onSubmit={emailPasswordLogin}>
                <h2 className="text-2xl mb-4">Login with Email</h2>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="password">Password:</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
                </div>
                <button type="submit" className="w-full p-2 mt-4 bg-blue-600 rounded hover:bg-blue-700">
                  Login with Email
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setShowForgotPassword(true)} className="text-blue-400 hover:underline">
                    Forgot Password?
                  </button>
                </div>
              </form>
              <br></br>
              <center>OR</center>
              <div className="flex mt-8 justify-center">
                <button type="button" onClick={googleauth} className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
                  <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                    <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
                  </svg>
                  Login with Google
                </button>
              </div>
            </div>
            
            <div className="flex mt-8 justify-center">
              Don't have an account?
            </div>
            <div className="text-center">
              <Link to='/signup' className="text-blue-400 hover:underline inline">Sign up</Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center mt-8">
            <div className="bg-gray-800 p-6 rounded-lg max-w-sm w-full">
              <form onSubmit={handleForgotPassword}>
                <h2 className="text-2xl mb-4">Reset Password</h2>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="resetPasswordEmail">Email:</label>
                  <input
                    type="email"
                    id="resetPasswordEmail"
                    value={resetPasswordEmail}
                    onChange={(e) => setResetPasswordEmail(e.target.value)}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    required
                  />
                  {resetPasswordError && <p className="text-red-500 text-sm mt-1">{resetPasswordError}</p>}
                  {resetPasswordSuccess && <p className="text-green-500 text-sm mt-1">{resetPasswordSuccess}</p>}
                </div>
                <button type="submit" className="w-full p-2 mt-4 bg-blue-600 rounded hover:bg-blue-700">
                  Send Password Reset Email
                </button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setShowForgotPassword(false)} className="text-blue-400 hover:underline">
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className='relative' style={{ top: '23rem' }}>
          <Footer />
        </div>
      </body>
    </>
  );
}

export default Login;
