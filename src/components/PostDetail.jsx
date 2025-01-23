import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import usertemp from '../assets/cryptoadd/default.png';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Adjust the path as needed
import { useAuthState } from 'react-firebase-hooks/auth'; // Assuming you're using this for auth state
import { auth } from '../../config/firebase'; // Adjust the path as needed
import Footer from './Footer'; // Include Footer component if needed
import loadingg from '../assets/loading.gif'; // Adjust the path to your loading gif

const PostDetail = () => {
  const { id } = useParams(); // Fetches the wallpaper ID from the URL
  const [wallpaper, setWallpaper] = useState(null);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth); // Get current user
  const [loading, setLoading] = useState(true); // Added loading state
  const [liked, setLiked] = useState(false); // State for like button
  const [tags, setTags] = useState([]); // State for tags
  const [userdetails, setUserdetails] = useState({ photoURL: '', name: '' }); // User details state

  useEffect(() => {
    const fetchWallpaper = async () => {
      if (!user) {
        setError('User not authenticated.');
        setLoading(false);
        return;
      }

      try {
        // Construct the document reference
        const docRef = doc(db, `users/${user.uid}/wallpapers/${id}`);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setWallpaper(docSnap.data());
          setTags(docSnap.data().tags.split(',')); // Assuming tags are stored as a comma-separated string
          setUserdetails({
            photoURL: user.photoURL || usertemp, // Use user photoURL or fallback
            name: user.displayName || 'User', // Use user displayName or fallback
          });
        } else {
          setError('Wallpaper not found.');
        }
      } catch (error) {
        console.error('Error fetching wallpaper data:', error);
        setError('An error occurred while fetching wallpaper data.');
      } finally {
        setLoading(false);
      }
    };

    fetchWallpaper();
  }, [id, user]); // Include `user` in dependency array

  const toggleLike = () => setLiked(!liked);
  const downloadimg = () => { /* Implement download functionality */ };
  const redirect = () => { /* Implement redirect functionality */ };
  const redirecttosearch = (tag) => { /* Implement redirect to search by tag */ };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img className='h-10' src={loadingg} alt="Loading" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen text-white flex items-center justify-center">
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  if (!wallpaper) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-xl">No wallpaper found.</p>
      </div>
    );
  }

  return (
    <div className="font-nunito dark text-white">
      <div id="warningsize" className="hidden">
        <div
          className="flex items-center justify-center p-4 m-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 mr-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div className="text-center">
            <span className="font-medium">Warning alert!</span>{" "}
            <p id="errmsg"></p>
          </div>
        </div>
      </div>

      <div className="container mx-auto">
        <div className="md:flex">
          <div className="md:w-1/2 sm:w-full p-4">
            <div className="flex flex-col">
            <img
  src={wallpaper.imageUrl}
  alt="Wallpaper"
  className="w-full max-w-4xl h-auto max-h-[80vh] mx-auto rounded-2xl"
/>

              <div className="mt-2 max-sm:ml-9 max-md:ml-14 lg:ml-11 xl:ml-20 text-white text-lg">
                {wallpaper.uploaddate}
              </div>
              <div className="mt-2 relative bottom-9 text-right max-sm:mr-10 max-md:mr-14 lg:mr-11 xl:mr-36 text-white text-lg">
                Attribution: {wallpaper.attribution}
              </div>
            </div>
          </div>
          <div className="md:w-1/2 sm:w-full p-4">
            <div className="mt-8">
              <div
                className="p-4 mb-4 hover:cursor-pointer text-2xl text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
                role="alert"
                onClick={redirect}
              >
                <div className="flex items-center">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={userdetails.photoURL || ''}
                    alt="user photo"
                  />
                  <div className="ml-2 hover:underline">
                    {userdetails.name}
                  </div>
                </div>
              </div>
              <div className="text-5xl max-sm:text-3xl max-md:text-4xl">
                {wallpaper.title}
              </div>
              <div className="text-2xl mt-5 max-sm:text-lg max-md:text-3xl">
                Description:
              </div>
              <div className="text-xl max-sm:text-lg max-md:text-2xl">
                {wallpaper.description}
              </div>
              <div className="text-2xl mt-5 max-sm:text-lg max-md:text-3xl">
                Tags:
              </div>
              <div id="display_tags" className="text-gray-300 flex flex-wrap">
                {tags.map((e) => (
                  <div
                    className="tag border rounded-md p-1 m-1 mt-2 flex items-center hover:bg-black hover:border-gray-300 hover:text-lg hover:cursor-pointer"
                    onClick={() => redirecttosearch(e)}
                    key={e}
                  >
                    <span className="tag-text">#{e}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-evenly mt-7">
                <div className="flex flex-col items-center text-center">
                  <input
                    id="heart"
                    type="checkbox"
                    checked={liked}
                    onChange={toggleLike}
                  />
                  <label htmlFor="heart">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-24 h-24"
                    >
                    </svg>
                  </label>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={downloadimg}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-24 h-24 text-blue-800 hover:text-blue-600"
                  >
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer /> {/* Include Footer component if needed */}
      </div>
    </div>
  );
};

export default PostDetail;
