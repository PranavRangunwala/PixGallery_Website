import React, { useEffect, useState } from 'react';
import { db } from "../../config/firebase";
import { getFirestore, doc, collection, getDoc, getDocs, deleteDoc , updateDoc } from 'firebase/firestore';
import Footer from './Footer';
import loadingg from "../assets/loading.gif";
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ReportDisplay = () => {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true); // New state to handle auth loading
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState(""); // Either 'success' or 'error'
  const [isAdmin, setIsAdmin] = useState(false);
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
          setAuthLoading(false); // Stop auth loading once done
        }
      } else {
        console.log("User not logged in.");
        navigate('/login'); // Redirect if not logged in
      }
    });

    // Cleanup the subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchWallpapers = async () => {
      try {
        console.log("Fetching wallpapers...");
  
        const reportSnapshot = await getDocs(collection(db, 'reports'));
        const reportsData = reportSnapshot.docs.map(doc => ({
          wallpaperId: doc.data().wallpaperId,
          wallDocId: doc.data().wallDocId,
          uploaderDocId: doc.data().uploaderId,
          reason: doc.data().reason,
          docid: doc.data().docid
        }));
  
        const matchedWallpapers = await Promise.all(reportsData.map(async (report) => {
          const wallpaperRef = doc(db, `users/${report.uploaderDocId}/wallpapers/${report.wallDocId}`);
          const wallpaperSnapshot = await getDoc(wallpaperRef);
  
          if (wallpaperSnapshot.exists()) {
            const wallpaperData = wallpaperSnapshot.data();
            return {
              imageURL: wallpaperData.imageUrl,
              wallpaperId: wallpaperData.uid,
              uploaderID: wallpaperData.uploader,
              reason: report.reason,
              reportDocId: report.docid
            };
          } else {
            console.log(`Wallpaper with ID ${report.wallDocId} does not exist.`);
            return null; // Return null if the wallpaper doesn't exist
          }
        }));
  
        // Filter out any null values (for non-existing wallpapers)
        setWallpapers(matchedWallpapers.filter(wallpaper => wallpaper !== null));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching wallpapers: ", error);
        setError(error);
        setLoading(false);
      }
    };
  
    fetchWallpapers();
  }, [db]); // Ensure that db is included in the dependency array

  const handleFalseReport = async (reportDocId) => {
    try {
      // Delete the report document from Firestore
      const reportRef = doc(db, 'reports', reportDocId);
      await deleteDoc(reportRef);

      // Show success alert
      showAlert('False Report deleted successfully!', 'success');

      // Optionally refresh the wallpapers list
      setWallpapers(prev => prev.filter(wallpaper => wallpaper.reportDocId !== reportDocId));
    } catch (error) {
      console.error("Error deleting report: ", error);
      // Show error alert
      showAlert('Error deleting report!', 'error');
    }
  };
  

  const handleDelete = async (userid, wallpaperId) => {
    try {
      //setLoading(true);

      const userRef = doc(db, 'users', userid);
      const wallref = collection(userRef, 'wallpapers');
      const querySnapshot = await getDocs(wallref);
      const wallpaper = querySnapshot.docs.find(doc => doc.data().uid === wallpaperId);

      const docRef = doc(wallref, wallpaper.id);
      await deleteDoc(docRef);

      // Show success alert
      showAlert('Wallpaper deleted successfully!', 'success');

      // Refresh the wallpaper list after deletion
      setWallpapers(prev => prev.filter(wallpaper => wallpaper.wallpaperId !== wallpaperId));
    } catch (error) {
      console.error("Error deleting wallpaper: ", error);
      // Show error alert
      showAlert('Error deleting wallpaper!', 'error');
    } finally {
      //setLoading(false);
    }
  };

  // Alert function
  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000); // Alert will disappear after 3 seconds
  };

  // Display loading screen while waiting for authentication and admin status check
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <img className="h-10" src={loadingg} alt="Loading" />
      </div>
    );
  }

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
    <div className="bg-gray-900 text-white min-h-screen">
    <header className="text-center p-6">
      <h1 className="text-4xl font-nunito text-green-400">Wallpapers Overview</h1>
      <p className="mt-2 text-lg">Check out the wallpapers based on reports below.</p>
    </header>

    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {wallpapers.map((wallpaper, index) => (
        <div
          key={index}
          className="bg-gray-700 dark:bg-gray-800 border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105"
        >
          <img src={wallpaper.imageURL} alt={`Wallpaper ${wallpaper.wallpaperId}`} className="w-full h-48 object-cover" />
          <div className="p-5">
            <h2 className="text-2xl font-bold dark:text-white">{`Wallpaper ID: ${wallpaper.wallpaperId}`}</h2>
            <p className="mt-2 dark:text-gray-300">{`Uploader ID: ${wallpaper.uploaderID}`}</p>
            <p className="mt-2 dark:text-gray-300">{`Reason: ${wallpaper.reason}`}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => window.location.href = `/posts/${wallpaper.wallpaperId}`}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                View Details
              </button>
              <button
                onClick={() => handleDelete(wallpaper.uploaderID, wallpaper.wallpaperId)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete Wallpaper
              </button>
              <button
                onClick={() => handleFalseReport(wallpaper.reportDocId)} // Pass the report ID or wallpaper ID
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Mark as False Report
              </button>
            </div>
          </div>
        </div>
      ))}
    </main>

    {/* Alert notification */}
    {alertMessage && (
      <div className={`fixed top-0 right-0 m-4 p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${alertType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
        {alertMessage}
      </div>
    )}

    <div className='relative top-40'>
        <Footer />
      </div>
  </div>
);
};

export default ReportDisplay;