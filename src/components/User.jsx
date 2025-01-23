import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import usertemp from '../assets/cryptoadd/default.png';
import Cards from "./Cards";
import { collection, getDoc, query, doc, where, limit, getDocs, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { useParams } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import loadingg from '../assets/loading.gif';

const User = () => {
  const [user] = useAuthState(auth);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        setIsAdmin(userDoc.exists() && userDoc.data().Admin === 1);
      }
    };

    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const qur = query(collection(db, 'users'), where('id', '==', id), limit(1));
        const querySnapshot = await getDocs(qur);

        if (querySnapshot.docs.length > 0) {
          const userData = querySnapshot.docs[0].data();
          setUserData(userData);
          setError(null);

          const userDocRef = doc(db, 'users', userData.docid);
          const subcollectionQuery = query(collection(userDocRef, 'wallpapers'));
          const querySnap = await getDocs(subcollectionQuery);
          const userwallsData = querySnap.docs.map(doc => ({ id: doc.id, data: doc.data() }));

          if (userwallsData.length === 0) {
            setError('User Does Not Have Uploaded Images Yet!!');
          } else {
            setImages(userwallsData);
          }
        } else {
          setUserData(null);
          setError('User not found.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUserData(null);
        setError('An error occurred while fetching user data.');
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleDeleteImage = async (uploader, imageId) => {
    try {
      const userRef = doc(db, 'users', uploader);
      const imageRef = doc(userRef, 'wallpapers', imageId);

      await deleteDoc(imageRef);
      setImages(prevImages => prevImages.filter(image => image.id !== imageId));
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img className='h-10' src={loadingg} alt="Loading" />
      </div>
    );
  }

  return (
    <body className="dark text-white font-nunito">
      <div className="p-4">
        <div className="flex w-full md:flex-row flex-col">
          <div className="w-full md:w-1/4">
            {userData && (
              <>
                <img
                  src={userData.photoURL || usertemp}
                  alt="User Image"
                  className="rounded-full w-24 h-24 mx-auto"
                />
                <h2 className="text-2xl font-bold my-4 text-center">{userData.name}</h2>
              </>
            )}
          </div>
          <div className="w-full md:w-3/4">
            {error && <h2 className="text-white-500 my-4">{error}</h2>}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 4 }, (_, colIndex) => (
                <div key={colIndex} className="grid gap-4">
                  {images.filter((_, index) => index % 4 === colIndex).map((cardData) => (
                    <div key={cardData.id} className="relative group">
                      <Cards
                        orientation={cardData.data.orientation}
                        name={cardData.data.title}
                        reso={cardData.data.resolution}
                        imgUrl={cardData.data.imageUrl}
                        likes={cardData.data.likes}
                        uid={cardData.data.uid}
                      />
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteImage(cardData.data.uploader, cardData.id)}
                          className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </body>
  );
};

export default User;
