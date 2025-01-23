import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from "../../config/firebase";
import { collection, getDocs, query, where, doc, getDoc , deleteDoc } from 'firebase/firestore';
import loadingg from "../assets/loading.gif";
import Footer from './Footer';
import usertemp from '../assets/cryptoadd/default.png';
import { deleteUser } from 'firebase/auth';

const UserSearchResult = () => {
  const { q } = useParams(); // `q` represents the search query passed via URL
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState(q || ""); // Initialize with q or empty string
  const [isAdmin, setIsAdmin] = useState(false); // Admin state
  const navigate = useNavigate(); // For redirection
  const auth = getAuth();

  // Check if the user is logged in and if they're an admin
  useEffect(() => {
    const checkUserAuth = async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDocRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              if (userData.Admin === 1) {
                setIsAdmin(true);
                console.log("Admin check passed");
              } else {
                setIsAdmin(false);
                console.log("Not an admin, redirecting...");
                navigate('/'); // Redirect non-admin to home or another page
              }
            }
          } catch (error) {
            console.error("Error checking user data:", error);
            setError("Error verifying user permissions.");
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
          navigate('/login'); // Redirect to login if the user is not logged in
        }
      });
    };

    checkUserAuth(); // Perform the auth check
  }, [auth, navigate]);

  // Fetch users if the user is an admin
  useEffect(() => {
    if (!isAdmin) return; // Don't fetch users if not an admin

    const fetchUsers = async () => {
      try {
        setSearchQuery(q);
        const usersRef = collection(db, 'users');
        const nameQuery = query(
          usersRef,
          where('name', '>=', q),
          where('name', '<=', q + '\uf8ff')
        );
        const emailQuery = query(
          usersRef,
          where('email', '>=', q),
          where('email', '<=', q + '\uf8ff')
        );

        const [nameSnapshot, emailSnapshot] = await Promise.all([getDocs(nameQuery), getDocs(emailQuery)]);

        let userData = [];
        const userIds = new Set(); // To ensure unique users

        nameSnapshot.forEach((doc) => {
          const user = { id: doc.id, ...doc.data() };
          if (!userIds.has(user.id)) {
            userData.push(user);
            userIds.add(user.id);
          }
        });

        emailSnapshot.forEach((doc) => {
          const user = { id: doc.id, ...doc.data() };
          if (!userIds.has(user.id)) {
            userData.push(user);
            userIds.add(user.id);
          }
        });

        if (userData.length > 0) {
          setUsers(userData);
          setError(null);
        } else {
          setUsers([]);
          setError("No users found.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [q, isAdmin]); // Dependency on isAdmin to ensure users are only fetched for admins

  const handleDelete = async (userId) => {
    console.log(userId);
    const confirmDelete = window.confirm("Are you sure you want to delete this user?"); // Confirm deletion
    if (!confirmDelete) return; // Exit if not confirmed

    try {
      await deleteDoc(doc(db, 'users', userId)); // Delete the user document from Firestore
      // Remove the deleted user from the local state using the correct ID
      setUsers(prevUsers => prevUsers.filter(user => user.docid !== userId)); // Update the users state
      setError(null); // Reset error if deletion is successful
    } catch (err) {
      console.error("Error deleting user:", err);
      setError("An error occurred while deleting the user."); // Set error if deletion fails
    }
  };
  

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img className="h-10" src={loadingg} alt="Loading" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="font-nunito dark text-white">
        <center><h1>Access denied. You are not authorized to view this page.</h1></center>
      </div>
    );
  }

  return (
    <div className="font-nunito dark text-white">
      {/* Search Bar */}
      <form className='mx-4 xl:mx-28 sm:mt-10'>
        <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
          </div>
          <input 
            type="search" 
            id="default-search" 
            value={searchQuery} 
            className="block w-full p-4 pl-10 text-xl text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Search Users" 
            required
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </form>

      <div className="text-center text-6xl mt-20 mb-10">
        User Search Results
      </div>

      <div className="mx-auto max-w-5xl">
        {error && users.length === 0 ? (
          <div className="my-52 flex items-center justify-center">
            <p>{error}</p>
          </div>
        ) : (
          users.length === 0 ? (
            <div className="my-52 flex items-center justify-center">
              <p>No results found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-800 rounded-lg shadow-lg p-5 relative">
                  <img
                    src={user.photoURL || usertemp} 
                    alt={user.name}
                    className="rounded-full w-24 h-24 mb-4 mx-auto object-cover"
                  />
                  <h2 className="text-xl font-semibold text-center">{user.name}</h2>
                  <p className="text-center text-gray-400 mb-4">{user.email}</p>
                  <div className="flex justify-between">
                    <button
                      onClick={() => window.location.href = `/user/${user.id}`} 
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg shadow-md"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDelete(user.docid)} 
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
};

export default UserSearchResult;
