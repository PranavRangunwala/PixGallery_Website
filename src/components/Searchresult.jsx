import React, { useState, useEffect } from 'react'
import Cards from './Cards'
import Footer from './Footer'
import { useParams } from 'react-router-dom';
import {
  collectionGroup,
  query,
  getDocs,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import loadingg from "../assets/loading.gif";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Searchresult = () => {
  const { q } = useParams();
  const [user] = useAuthState(auth);
  const [wallpaper, setWallpaper] = useState(null);
  const [loading, setLoading] = useState(true); // Added loading state
  const [error, setError] = useState(null); // Added error state
  const [userwallsjson, setUserwallsjson] = useState({})
  const [c1, setC1] = useState({})
  const [c2, setC2] = useState({})
  const [c3, setC3] = useState({})
  const [c4, setC4] = useState({})

  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = (event) => {
    event.preventDefault();
    window.location = `/searchresult/${encodeURIComponent(searchQuery)}`;
  };

  const handleKeyDown = (event) => {
    // If Enter key is pressed and the searchQuery is not empty, submit the form
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      handleSearch(event);
    }
  };

  useEffect(() => {
    const fetchWallpaperDetails = async () => {
      try {
        setSearchQuery(q);
        const qur = query(collectionGroup(db, "wallpapers"));
        const querySnapshot = await getDocs(qur);
  
        if (!querySnapshot.empty) {
          const wallpaperData = [];
          querySnapshot.forEach((doc) => {
            wallpaperData.push({ id: doc.id, ...doc.data() });
          });
  
          // Convert search query to lowercase
          const lowerCaseQuery = q.toLowerCase();
  
          // Filter the results based on the query `q` in a case-insensitive way
          const filteredWallpapers = wallpaperData.filter(wallpaper =>
            wallpaper.title.toLowerCase().includes(lowerCaseQuery) ||
            (wallpaper.description && wallpaper.description.toLowerCase().includes(lowerCaseQuery)) ||
            (wallpaper.tags && wallpaper.tags.toLowerCase().includes(lowerCaseQuery))
          );
  
          console.log("Filtered Wallpapers:", filteredWallpapers);
          setWallpaper(filteredWallpapers);
  
          const jsonWalls = JSON.parse(JSON.stringify(filteredWallpapers));
          console.log('jsondata', jsonWalls);
  
          const keys = Object.keys(jsonWalls);
          keys.forEach((key, index) => {
            const currentItem = jsonWalls[key];
            const targetVariable =
              index % 4 === 0 ? setC1 :
                index % 4 === 1 ? setC2 :
                  index % 4 === 2 ? setC3 :
                    setC4;
  
            targetVariable((prevData) => {
              return { ...prevData, [key]: currentItem };
            });
          });
  
          setError(null);
        } else {
          setWallpaper(null);
          setError("Wallpaper not found.");
        }
      } catch (error) {
        console.error("Error fetching wallpaper data:", error);
        setWallpaper(null);
        setError("An error occurred while fetching wallpaper data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchWallpaperDetails();
  }, [q]);
  

  useEffect(() => {
    console.log("wallapper from usestate", wallpaper); // This will be executed after the state is updated
  }, [wallpaper]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img className="h-10" src={loadingg} alt="Loading" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen text-white flex items-center justify-center">
        <p>{error}</p>
      </div>
    );
  }




  return (
    <body className=" font-nunito dark text-white">
      <div>
        <form className=' mx-4 xl:mx-28  sm:mt-10' onSubmit={handleSearch}>
          <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input type="search" id="default-search" defaultValue={q} class="block w-full p-4 pl-10 text-xl text-gray-900 border border-gray-300 rounded-full bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Search Wallpapers" required onKeyDown={handleKeyDown} onChange={(e) => setSearchQuery(e.target.value)} />
            <button type="submit" class="text-white absolute right-3.5 bottom-3.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 shadow-md dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
          </div>
        </form>
        <div className='mx-auto max-w-5xl'>
          {(!Object.keys(c1).length && !Object.keys(c2).length && !Object.keys(c3).length && !Object.keys(c4).length) ? (
            <div className="my-52 flex items-center justify-center">
              <p>No results found</p>
            </div>
          ) : (
            // Your other JSX content here
            <div>
              {/* Other JSX content */}
            </div>
          )}
          <div class="grid grid-cols-2 m-5 md:grid-cols-4 gap-4 ">
            <div className="grid gap-4">
              {Object.values(c1).map((cardData, index) => (
                <div key={index}> {/* Add a unique key for each element */}
                  {cardData && ( // Check if cardData is not undefined
                    <Cards
                      orientation={cardData.orientation || ''}
                      name={cardData.title || ''}
                      reso={cardData.resolution || ''}
                      imgUrl={cardData.imageUrl || ''}
                      likes={cardData.likes || 0}
                      uid={cardData.uid || ''}
                    />
                  )}
                </div>
              ))}
            </div>

            <div class="grid gap-4">
              {Object.values(c2).map((cardData, index) => (
                <div key={index}> {/* Add a unique key for each element */}
                  {cardData && ( // Check if cardData is not undefined
                    <Cards
                      orientation={cardData.orientation || ''}
                      name={cardData.title || ''}
                      reso={cardData.resolution || ''}
                      imgUrl={cardData.imageUrl || ''}
                      likes={cardData.likes || 0}
                      uid={cardData.uid || ''}
                    />
                  )}
                </div>
              ))}

            </div>

            <div class="grid gap-4">
              {Object.values(c3).map((cardData, index) => (
                <div key={index}> {/* Add a unique key for each element */}
                  {cardData && ( // Check if cardData is not undefined
                    <Cards
                      orientation={cardData.orientation || ''}
                      name={cardData.title || ''}
                      reso={cardData.resolution || ''}
                      imgUrl={cardData.imageUrl || ''}
                      likes={cardData.likes || 0}
                      uid={cardData.uid || ''}
                    />
                  )}
                </div>
              ))}
            </div>
            <div class="grid gap-4">
              {Object.values(c4).map((cardData, index) => (
                <div key={index}> {/* Add a unique key for each element */}
                  {cardData && ( // Check if cardData is not undefined
                    <Cards
                      orientation={cardData.orientation || ''}
                      name={cardData.title || ''}
                      reso={cardData.resolution || ''}
                      imgUrl={cardData.imageUrl || ''}
                      likes={cardData.likes || 0}
                      uid={cardData.uid || ''}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {wallpaper && wallpaper.length === 1 && wallpaper[0].orientation === 'horizontal' ? (
        <div className='mt-80'></div>
      ) : (
        wallpaper && wallpaper.length < 5 ? (
          <div className='mt-44'></div>
        ) : (
          <div></div>
        )
      )}

      <Footer />

    </body>
  )
}
export default Searchresult