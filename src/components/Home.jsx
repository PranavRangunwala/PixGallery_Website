import React, { useState,useEffect } from 'react';
import Cards from './Cards'
import Footer from './Footer'
import {
  collectionGroup,
  query,
  getDocs,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import loadingg from "../assets/loading.gif";

const Home = () => {
    const [orientation, setOrientation] = useState(true);
    const [loading, setLoading] = useState(true); // Added loading state
    const [error, setError] = useState(null); // Added error state
    const [verWallpaper, setVerWallpaper] = useState(null)
    const [horiWallpaper, setHoriWallpaper] = useState(null)

    useEffect(() => {
      const fetchWallpaperDetails = async () => {
        try {
          const qur = query(
            collectionGroup(db, "wallpapers"),
            orderBy("likes", "desc"), // Order by likes in descending order
            limit(280)
          );
          const querySnapshot = await getDocs(qur);
      
          if (!querySnapshot.empty) {
            const wallpaperData = [];
            querySnapshot.forEach((doc) => {
              wallpaperData.push({ id: doc.id, ...doc.data() });
            });
      
            const jsonWalls = JSON.parse(JSON.stringify(wallpaperData));
      
            // Separating wallpapers based on orientation
            const verticalWallpapers = jsonWalls.filter(
              (wallpaper) => wallpaper.orientation === "vertical"
            );
      
            const horizontalWallpapers = jsonWalls.filter(
              (wallpaper) => wallpaper.orientation === "horizontal"
            );
      
            setVerWallpaper(verticalWallpapers);
            setHoriWallpaper(horizontalWallpapers);
      
            setError(null);
          } else {
            setVerWallpaper(null);
            setHoriWallpaper(null);
            setError("Wallpaper not found.");
          }
        } catch (error) {
          console.error("Error fetching wallpaper data:", error);
          setVerWallpaper(null);
          setHoriWallpaper(null);
          setError("An error occurred while fetching wallpaper data.");
        } finally {
          setLoading(false);
        }
      };
    
      fetchWallpaperDetails();
    }, []);

    useEffect(() => {
      console.log('vertical wallpeprs vy likes usestate',verWallpaper);
      console.log('horizontal wallpeprs vy likes usestate',horiWallpaper)
    }, [verWallpaper,horiWallpaper])

    const statevertical = (e)=>{
        e.preventDefault();
        setOrientation(true);
    }
    const statehorizontal = (e) => {
        e.preventDefault();
        setOrientation(false);
      }
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

    if (orientation) {
  return (
    <>  
        <body class="dark text-white" >
            <h1>{orientation}</h1>
            <h1 className='flex justify-center text-4xl font-nunito my-4'>Trending Wallpapers</h1>
            <div className='flex justify-center text-4xl font-nunito my-4'>
                <div class="inline-flex  rounded-md shadow-sm" role="group">
                <button
        type="button"
        onClick={statevertical}
        className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white ${orientation ? ' underline' : ''}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline-block mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
        </svg>
        Phone
      </button>
      
      <button
        type="button"
        onClick={statehorizontal}
        className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 inline-block mr-2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
        </svg>
        Desktop
      </button>
                </div>
            </div>
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8" >
                <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:grid-cols-3 lg:grid-cols-5 xl:gap-x-5 xl:gap-y-5">
                {Object.values(verWallpaper).map((cardData, index) => (
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
                <Footer/>
        </body>
    </>
  )}
  else{
    return(
        //for horizontal wallpapers
        <>  
        <body class="dark text-white" >
            <h1>{orientation}</h1>
            <h1 className='flex justify-center text-4xl font-nunito my-4'>Trending Wallpapers</h1>
            <div className='flex justify-center text-4xl font-nunito my-4'>
                <div class="inline-flex  rounded-md shadow-sm" role="group">
                    <button type="button" onClick={statevertical} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                        </svg>
                        Phone
                    </button>
                    <button type="button" onClick={statehorizontal} className={`px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white${!orientation ? ' underline' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 inline-block mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                        </svg>
                        Desktop
                    </button>
                </div>
            </div>
            <div className="mx-auto max-w-8xl px-4 py-16 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8" >
                <div className="mt-3 grid grid-cols-1 gap-x-3 gap-y-3 md:grid-cols-2">
                {Object.values(horiWallpaper).map((cardData, index) => (
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
                <Footer/>
        </body>
    </>
    )
  }
}
export default Home