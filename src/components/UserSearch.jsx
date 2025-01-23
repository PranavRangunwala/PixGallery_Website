import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Footer from './Footer';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import loadingg from "../assets/loading.gif";

const UserSearchResult = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the logged-in user is an admin
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch the user's document from Firestore
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log("User Data:", userData.Admin);

            // Check if the user has an Admin field with value 1
            setIsAdmin(userData.Admin === 1);
          } else {
            console.log("User document does not exist.");
            setIsAdmin(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("User not logged in.");
        navigate('/login'); // Redirect if not logged in
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  const handleSearch = (event) => {
    event.preventDefault();
    window.location = `/usersearchresult/${encodeURIComponent(searchQuery)}`;
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      handleSearch(event);
    }
  };

  if (!isAdmin) {
    return <div className="font-nunito dark text-white"><center><h1>Access denied. You are not authorized to view this page.</h1></center></div>;
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img className="h-10" src={loadingg} alt="Loading" />
      </div>
    );
  }

  return (
    <body className="font-nunito dark text-white">
      <div>
        <h1 className='text-center text-6xl relative top-48 max-md:top-28'>
          Search for Users...
        </h1>
        <form
          className='mt-64 max-md:mt-36 max-sm:mx-9 max-md:mx-14 max-lg:mx-20 max-xl:mx-20 xl:mx-32'
          onSubmit={handleSearch}
        >
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-4 pl-10 text-xl text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              required
            />
            <button
              type="submit"
              className="text-white absolute right-3.5 bottom-3.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className='relative top-40'>
        <Footer />
      </div>
    </body>
  );
};

export default UserSearchResult;