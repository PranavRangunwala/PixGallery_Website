import React, { useEffect, useState } from 'react';
import usertemp from '../assets/cryptoadd/default.png';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, query , deleteDoc} from 'firebase/firestore';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import InvoiceGenerator from './InvoiceGenerator'; // Import InvoiceGenerator component

const MyAccount = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [apiManageData, setApiManageData] = useState({ Plans: {} });
  const [apiManageExists, setApiManageExists] = useState(true);
  const [activePlan, setActivePlan] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch user data and API Management data
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch user data
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }

          // Fetch API Management settings
          const apiManageRef = doc(db, `users/${user.uid}/ApiManage`, 'settings');
          const apiManageDoc = await getDoc(apiManageRef);
          if (apiManageDoc.exists()) {
            setApiManageData(apiManageDoc.data());
            setActivePlan(apiManageDoc.data().ActivePlan);
          } else {
            setApiManageExists(false);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    const fetchUploadedImages = async () => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.uid);
          const wallpapersRef = collection(userRef, 'wallpapers');
          const q = query(wallpapersRef);
          const querySnapshot = await getDocs(q);

          const images = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data()
          }));

          setUploadedImages(images);
        } catch (error) {
          console.error('Error fetching uploaded images:', error);
        }
      }
    };
    
    fetchData();
    fetchUploadedImages();
  }, [user]);

  // Handle toggling the plan
  const handleToggle = async (planName) => {
    if (user && apiManageData) {
      try {
        const updatedPlans = { ...apiManageData.Plans };
        Object.keys(updatedPlans).forEach((plan) => {
          updatedPlans[plan].Status = '0';
        });
        updatedPlans[planName].Status = '1';

        const apiManageRef = doc(db, `users/${user.uid}/ApiManage`, 'settings');
        await updateDoc(apiManageRef, {
          ActivePlan: planName,
          Plans: updatedPlans,
        });

        setActivePlan(planName);
        setApiManageData((prevData) => ({
          ...prevData,
          ActivePlan: planName,
          Plans: updatedPlans,
        }));
      } catch (error) {
        console.error('Error updating plan:', error);
      }
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const imageRef = doc(userRef, 'wallpapers', imageId);

        await deleteDoc(imageRef);

        setUploadedImages((prevImages) => prevImages.filter((image) => image.id !== imageId));
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  const calculateCumulativeApiLimit = () => {
    if (apiManageData?.Plans) {
      return Object.values(apiManageData.Plans).reduce((sum, plan) => sum + (parseInt(plan.ApiLimit) || 0), 0);
    }
    return 0;
  };

  if (!user) {
    return <h1 className="flex justify-center text-3xl mt-10 text-gray-300">You need to be logged in</h1>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        {userData && (
          <div className="flex items-center mb-6">
            <img
              src={userData.photoURL || usertemp}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-200">{userData.name}</h1>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>
        )}

        {apiManageExists && apiManageData ? (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-300">API Management</h2>

            <div className="mb-4">
              <p className="text-gray-400">Userid: {apiManageData.Userid}</p>
              <button
                onClick={() => copyToClipboard(apiManageData.Userid)}
                className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
              >
                Copy
              </button>
            </div>
            <div className="mb-4">
              <p className="text-gray-400">SecretKey: {apiManageData.SecretKey}</p>
              <button
                onClick={() => copyToClipboard(apiManageData.SecretKey)}
                className="bg-blue-500 text-white px-2 py-1 rounded ml-2"
              >
                Copy
              </button>
            </div>

            <div className="mb-4">
              <p className="text-gray-300">Total API Limit: {calculateCumulativeApiLimit()} requests</p>
            </div>

            <div className="mb-4">
              {apiManageData?.Plans && Object.keys(apiManageData.Plans).length > 0 ? (
                <table className="min-w-full table-auto border-collapse text-left">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-gray-300">Plan</th>
                      <th className="px-4 py-2 text-gray-300">ApiLimit</th>
                      <th className="px-4 py-2 text-gray-300">HourlyLimit</th>
                      <th className="px-4 py-2 text-gray-300">Purchase Date</th>
                      <th className="px-4 py-2 text-gray-300">Purchase Time</th>
                      <th className="px-4 py-2 text-gray-300">Price Paid</th>
                      <th className="px-4 py-2 text-gray-300">Toggle</th>
                      <th className="px-4 py-2 text-gray-300">Download Bill</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(apiManageData.Plans).map((planName) => {
                      const plan = apiManageData.Plans[planName];
                      const createdAt = new Date(plan.CreatedAt);

                      const formattedDate = createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
                      const formattedTime = createdAt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                      return (
                        <tr key={planName} className="border-t border-gray-700">
                          <td className="px-4 py-2 text-gray-400">{planName}</td>
                          <td className="px-4 py-2 text-gray-400">{plan.ApiLimit}</td>
                          <td className="px-4 py-2 text-gray-400">{plan.HourlyLimit}</td>
                          <td className="px-4 py-2 text-gray-400">{formattedDate}</td>
                          <td className="px-4 py-2 text-gray-400">{formattedTime}</td>
                          <td className="px-4 py-2 text-gray-400">{plan.Price}</td>
                          <td className="px-4 py-2">
                            <button
                              className={`px-4 py-2 rounded ${activePlan === planName ? 'bg-blue-500' : 'bg-gray-600'}`}
                              onClick={() => handleToggle(planName)}
                            >
                              {activePlan === planName ? 'Active' : 'Activate'}
                            </button>
                          </td>
                          <td className="px-4 py-2">
                            {/* Button to trigger the PDF download for this specific plan */}
                            <InvoiceGenerator
                              invoiceId = {plan.PaymentId}
                              uname={userData.name}
                              email = {user.email}
                              plan={planName}
                              price = {plan.Price}
                              formattedDate={formattedDate}
                              formattedTime={formattedTime}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-400">No plans available</p>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800 p-4 rounded-lg mb-6">
            <p className="text-gray-400">No API Management settings found</p>
          </div>
        )}

        <h2 className="text-xl font-semibold mb-4 text-gray-300">Uploaded Images</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.length ? (
            uploadedImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.imageUrl}
                  alt={image.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/posts/${image.uid}`} className="text-white text-lg font-bold">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="absolute bottom-2 right-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No images uploaded yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyAccount;