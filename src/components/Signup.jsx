import React, { useState, useEffect } from 'react'; // Import useEffect
import { auth } from '../../config/firebase';
import { signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState
import { db } from '../../config/firebase';
import { setDoc, doc } from 'firebase/firestore';
import shortid from 'shortid';
import { v4 as uuidv4 } from 'uuid';  
import Footer from './Footer';

const Signup = () => {
  const [user] = useAuthState(auth); // Check user state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [verificationMessage, setVerificationMessage] = useState('');
  const navigate = useNavigate();

  // Redirect if the user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/'); // Redirect to homepage
    }
  }, [user, navigate]);

  const googleAuth = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      if (user) {
        const uid = shortid.generate();
        const userData = {
          name: user.displayName || 'Anonymous',
          email: user.email,
          photoURL: user.photoURL || '',
          id: uid,
          docid: user.uid,
          //imagee : "cghvhcdkbsjkcbshdvchs"
        };

        try {
          const userRef = doc(db, 'users', user.uid);
          await setDoc(userRef, userData);
          console.log('User data added to Firestore');

          const apiManageRef = doc(db, `users/${user.uid}/ApiManage`, 'settings');
          const apiManageData = {
            Userid: user.uid,
            SecretKey: generateSecretKey(),
            ActivePlan: "Free",
            Plans: {
              Free: {
                HourlyLimit: 10,
                ApiLimit: 50,
                Price: 0,
                Status: "1",
                CreatedAt: new Date().toISOString()
              }
            },
          };
          await setDoc(apiManageRef, apiManageData);
          console.log('ApiManage data added to Firestore');

          navigate('/login');
        } catch (error) {
          console.error('Error adding user data:', error);
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const generateSecretKey = () => {
    return uuidv4();
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!username.trim()) {
      formErrors.username = 'Username is required';
      isValid = false;
    } else if (!usernameRegex.test(username)) {
      formErrors.username = 'Username contains invalid characters';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      formErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    if (password !== confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const emailPasswordSignup = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
          await sendEmailVerification(user);
          console.log('Verification email sent');
          setVerificationMessage('A verification email has been sent to your email address.');

          const uid = shortid.generate();
          const userData = {
            name: username,
            email: user.email,
            photoURL: user.photoURL || '',
            id: uid,
            docid: user.uid,
            // imagee : "cghvhcdkbsjkcbshdvchs"
          };

          try {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, userData);
            console.log('User data added to Firestore');

            const apiManageRef = doc(db, `users/${user.uid}/ApiManage`, 'settings');
            const apiManageData = {
              Userid: user.uid,
              SecretKey: generateSecretKey(),
              ActivePlan: "Free",
              Plans: {
                Free: {
                  HourlyLimit: 10,
                  ApiLimit: 50,
                  Price: 0,
                  Status: "1",
                  CreatedAt: new Date().toISOString()
                }
              },
            };
            

            await setDoc(apiManageRef, apiManageData);
            console.log('ApiManage data added to Firestore');

            await auth.signOut();
            console.log('User logged out after signup');

            navigate('/login');
          } catch (error) {
            console.error('Error adding user data:', error);
          }
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="dark text-white min-h-screen flex flex-col">
      <div className="flex justify-center mt-8 flex-grow">
        <div className='bg-gray-800 p-10 rounded-lg w-full max-w-md'>
          <form onSubmit={emailPasswordSignup} className="">
            <h2 className="text-2xl mb-4">Signup with Email</h2>
            <div className="mb-4">
              <label className="block mb-2" htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded bg-gray-700 text-white"
                required
              />
              {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
            </div>
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
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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
            <button type="submit" className="w-full p-2 mt-4 bg-blue-600 rounded hover:bg-blue-700">Signup</button>
          </form>

          {verificationMessage && (
            <p className="text-green-500 text-sm mt-4">{verificationMessage}</p>
          )}

          <div className="flex justify-center mt-8">
            <p className="text-center text-lg font-semibold">or</p>
          </div>

          <div className="flex mt-8 justify-center">
          <center>
            <button type="button" onClick={googleAuth} className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 w-full">
            <svg className="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                    <path fillRule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clipRule="evenodd" />
                  </svg>
              Signup with Google
            </button>
            </center>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
