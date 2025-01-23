import React, { useState, useEffect, useRef } from 'react';
import usertemp from '../assets/cryptoadd/default.png';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const Navbarme = () => {
  const [user] = useAuthState(auth);
  const [useropen, setUseropen] = useState(false);
  const dropdownRef = useRef(null);
  const [userdata, setUserdata] = useState(null);
  const [navopen, setNavopen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch user data when user is logged in
  useEffect(() => {
    const getUserData = async (uid) => {
      const userDoc = doc(db, 'users', uid);
      try {
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          setUserdata(docSnapshot.data());
        } else {
          console.log('User not found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (user) {
      if (user.providerData[0]?.providerId === 'password') {
        getUserData(user.uid);
      }
    } else {
      // If user logs out, reset user data and isAdmin flag
      setUserdata(null);
      setIsAdmin(false);
    }
  }, [user]);

  // Set isAdmin flag based on user data
  useEffect(() => {
    if (userdata) {
      setIsAdmin(userdata.Admin === 1);
    }
  }, [userdata]);

  // Handle navbar visibility on mobile
  useEffect(() => {
    const navbar = document.getElementById('navbar-user');
    if (navbar) {
      navbar.classList.toggle('hidden', !navopen);
      navbar.classList.toggle('block', navopen);
    }
  }, [navopen]);

  const changeNav = () => {
    setNavopen(prev => !prev);
  };

  // Close the user dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUseropen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const changeUserBar = () => {
    setUseropen(prev => !prev);
  };

  const userName = user && user.providerData[0]?.providerId === 'password'
    ? userdata?.name || 'User'
    : user?.displayName || 'User';

  const userPhoto = user && user.providerData[0]?.providerId === 'password'
    ? userdata?.photoURL || usertemp
    : user?.photoURL || usertemp;

  return (
    <nav className="bg-white font-nunito border-gray-200 dark:bg-gray-800 mb-1">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center">
          <span className="self-center text-2xl whitespace-nowrap dark:text-white">PixGallery</span>
        </Link>

        <div className="flex items-center md:order-2">
          <Link to='/search' className='text-white mr-5'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={changeUserBar}
            className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 relative"
            id="user-menu-button"
          >
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full" id='userprofile' src={userPhoto} alt="User" />
          </button>

          <div
            ref={dropdownRef}
            className={`absolute top-20 max-lg:right-3 right-8 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 ${useropen ? 'block' : 'hidden'}`}
            style={{ zIndex: 9999 }}
          >
            <div className="px-4 py-3">
              <span className="block text-sm text-gray-900 dark:text-white">{userName}</span>
              <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user ? user.email : ""}</span>
            </div>
            <ul className="py-2" aria-labelledby="user-menu-button">
              <li>
                <Link to="/upload" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Upload Image</Link>
              </li>
              <li>
                <Link to="/api" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Api Documentation</Link>
              </li>
              {user ? (
                <li>
                  <Link to="/myaccount" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">My account</Link>
                </li>
              ) : null}
              {isAdmin && (
                <>
                  <li>
                    <Link to="/reports" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Report</Link>
                  </li>
                  <li>
                    <Link to="/usersearch" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">User Search</Link>
                  </li>
                </>
              )}
              {user ? (
                <>
                  {user.providerData[0]?.providerId === 'password' && (
                    <li>
                      <Link to="/reset-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Reset Password</Link>
                    </li>
                  )}
                  <li>
                    <Link to="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Sign out</Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Signup</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
          <button data-collapse-toggle="navbar-user" id='navuser' onClick={changeNav} type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
          <ul className="flex flex-col font-medium p-4 md:p-0 lg:mr-10 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-800 dark:border-gray-700">
            <li className='px-3'>
              <Link to="/" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Trending Wallpapers</Link>
            </li>
            <li className='px-3'>
              <Link to="/search" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Search</Link>
            </li>
            <li className='px-3'>
              <Link to="/upload" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Upload wallpaper</Link>
            </li>
            <li className='px-3'>
              <Link to="/payment" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Plans</Link>
            </li>
            <li className='px-3'>
              <Link to="/genwallpaper" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Generate a wallpaper</Link>
            </li>
            <li className='px-3'>
              <Link to="/contactme" className="block py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbarme;
