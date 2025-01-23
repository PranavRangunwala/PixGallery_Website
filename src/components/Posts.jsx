import React, { useEffect, useState } from "react";
import usertemp from '../assets/cryptoadd/default.png';
import {
  collectionGroup,
  addDoc,
  query,
  where,
  limit,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  increment,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { useParams } from "react-router-dom";
import loadingg from "../assets/loading.gif";
import Footer from "./Footer";
import { auth } from "../../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const Posts = () => {
  const [user] = useAuthState(auth);
  const { id } = useParams(); // Access the id parameter from the route
  const [wallpaper, setWallpaper] = useState(null);
  const [userdetails, setUserdetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [docid, setDocid] = useState("");
  const [reporting, setReporting] = useState(false); // State to manage reporting
  const [reportReason, setReportReason] = useState(""); // State to manage report reason
  const [alertMessage, setAlertMessage] = useState(""); // State for alerts
  const [alertType, setAlertType] = useState(""); // State for alert type (success/error)
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [newTitle, setNewTitle] = useState(""); // State to hold new title
  const [newDescription, setNewDescription] = useState(""); // State to hold new description
  const [newTags, setNewTags] = useState(""); // State to hold new tags



  const insertlikeindb = async () => {
    if (!user) {
      showAlert("To like a post you need to login first", "error");
      return;
    }
    if (liked) {
      return;
    }
    const likedata = {
      postid: wallpaper.uid,
      timestamp: Date()
    };
    const userRef = doc(db, 'users', user.uid);
    const likeRef = collection(userRef, 'likedwalls');
    await addDoc(likeRef, likedata);
    setLiked(true);
  };

  const removelikefromdb = async () => {
    if (!user) {
      showAlert("To remove a like, you need to login first", "error");
      return;
    }
    if (!liked || !wallpaper || !wallpaper.uid) {
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const likeRef = collection(userRef, 'likedwalls');
    const querySnapshot = await getDocs(likeRef);

    const likedPost = querySnapshot.docs.find(doc => doc.data().postid === wallpaper.uid);

    if (likedPost) {
      const docRef = doc(likeRef, likedPost.id);

      try {
        await deleteDoc(docRef);
        console.log('Like removed successfully.');
        setLiked(false);
      } catch (error) {
        console.error('Error removing like:', error);
      }
    }
  };
  //working

  const setlikedstatefromdb = async () => {
    const userRef = doc(db, 'users', user.uid);
    const likeRef = collection(userRef, 'likedwalls');
    const querySnapshot = await getDocs(likeRef);
    const likedPost = querySnapshot.docs.find(doc => doc.data().postid === wallpaper.uid);
    if (likedPost) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }

  const toggleLike = async () => {
    // Check if the user has already liked the post
      const userRef = doc(db, "users", userdetails.docid);
      const wallpaperRef = doc(userRef, "wallpapers", docid);
    if (!liked) {
      await updateDoc(wallpaperRef, {
        likes: increment(1),
      });
      setWallpaper((prevWallpaper) => ({
        ...prevWallpaper,
        likes: prevWallpaper.likes + 1,
      }));
      insertlikeindb();
    } else {
      await updateDoc(wallpaperRef, {
        likes: increment(-1),
      });
      setWallpaper((prevWallpaper) => ({
        ...prevWallpaper,
        likes: prevWallpaper.likes - 1,
      }));
      removelikefromdb();
    }
    // Update the liked state
    setLiked((prevLiked) => !prevLiked);
  };

  const redirect = (e) => {
    e.preventDefault();
    window.location = `/user/${userdetails.id}`;
    //make this work with LINK in react-router and not this. as this will reload the page
  };

  const redirecttosearch = (tag) => {
    // Remove spaces from the tag (replace with '-')
    const formattedTag = tag.replace(/\s+/g, '');
    window.location = `/searchresult/${formattedTag}`;
    // Alternatively, use React Router's Link to navigate without a page reload
    // history.push(`/searchresult/${formattedTag}`);
  };
  

  useEffect(() => {
    console.log("docid from usestate", docid); // This will be executed after the state is updated
    console.log("wallapper from usestate", wallpaper); // This will be executed after the state is updated
  }, [docid,wallpaper]);

  
  setlikedstatefromdb();
  useEffect(() => {
    const fetchWallpaperDetails = async () => {
      try {
        const qur = query(
          collectionGroup(db, "wallpapers"),
          where("uid", "==", id),
          limit(1),
        );
        const querySnapshot = await getDocs(qur);

        if (!querySnapshot.empty) {
          const wallpaperData = querySnapshot.docs[0].data();
          const doccid = querySnapshot.docs[0].id;

          setDocid(doccid);
          setWallpaper(wallpaperData);
          setError(null);

          const uploaderRef = doc(db, "users", wallpaperData.uploader);
          const userDocSnap = await getDoc(uploaderRef);
          if (userDocSnap.exists()) {
            setUserdetails(userDocSnap.data());
          } else {
            setUserdetails(null);
          }
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
  }, [id]);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setTimeout(() => {
      setAlertMessage("");
      setAlertType("");
    }, 3000); // Alert will disappear after 3 seconds
  };

  const handleReport = async () => {
    if (!reportReason) {
      showAlert("Please provide a reason for reporting.");
      return;
    }
  
    const reportData = {
      docid: null, // Will be set after adding the document
      wallpaperId: wallpaper.uid,
      reason: reportReason,
      uploaderId: wallpaper.uploader,
      wallDocId: wallpaper.docid,
      reporterId: user.uid,
      timestamp: Date.now(),
    };
  
    try {
      const reportRef = collection(db, "reports");
  
      // Check if a report already exists for this wallpaper by the same user
      const existingReportsQuery = query(
        reportRef,
        where("wallpaperId", "==", wallpaper.uid),
        where("reporterId", "==", user.uid) // Also check for the same reporter
      );
  
      const existingReportsSnapshot = await getDocs(existingReportsQuery);
  
      if (!existingReportsSnapshot.empty) {
        showAlert("Thank you for your report. It has been submitted.");
        return; // Exit if a report already exists
      }
  
      // Add the new report
      const docRef = await addDoc(reportRef, reportData);
      
      // Update reportData with the generated docid
      reportData.docid = docRef.id;
  
      // Optionally, you can also update the document with the docid
      await updateDoc(docRef, { docid: reportData.docid });
  
      showAlert("Thank you for your report. It has been submitted.");
      setReporting(false);
      setReportReason(""); // Clear the report reason
    } catch (error) {
      console.error("Error reporting the wallpaper:", error);
    }
  };


  const handleEdit = () => {
    setIsEditing(true);
    setNewTitle(wallpaper.title);
    setNewDescription(wallpaper.description);
    setNewTags(wallpaper.tags);
  };

  const handleSaveEdits = async () => {
    if (user && user.uid === wallpaper.uploader) {
      const wallpaperRef = doc(db, "users", userdetails.docid);
      const wallpaperDocRef = doc(wallpaperRef, "wallpapers", docid);

      try {
        await updateDoc(wallpaperDocRef, {
          title: newTitle,
          description: newDescription,
          tags: newTags,
        });

        setWallpaper((prevWallpaper) => ({
          ...prevWallpaper,
          title: newTitle,
          description: newDescription,
          tags: newTags,
        }));

        setIsEditing(false);
      } catch (error) {
        console.error("Error updating wallpaper data:", error);
      }
    }
  };

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

  const onButtonClick = () => {
    const pdfUrl = wallpaper.imageUrl;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Image.pdf"; // specify the filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const downloadimg = async () => {
  if (!wallpaper || !wallpaper.imageUrl) {
    console.error("Invalid image URL");
    return;
  }

  try {
    const response = await fetch(wallpaper.imageUrl, { mode: "cors" });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${wallpaper.title || "wallpaper"}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the Blob URL
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Image download failed", error);
  }
};

  const orientation = wallpaper.orientation;
  //fetch these values from the db

  const tags = wallpaper.tags.split(",");

  if (orientation == "vertical") {
    return (
      <body className="font-nunito dark text-white">
  {alertMessage && (
    <div
      className={`fixed top-0 right-0 m-4 p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${
        alertType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
      }`}
    >
      {alertMessage}
    </div>
  )}




  <div id="warningsize" className="hidden">
    {/* Warning alert */}
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
        <span className="font-medium">Warning alert!</span> <p id="errmsg"></p>
      </div>
    </div>
  </div>

  <div className="container mx-auto">
    <div className="md:flex">
      <div className="md:w-1/2 sm:w-full p-4">
        <div
          className="inline-block my-1 max-sm:ml-9 max-md:ml-14 lg:ml-11 xl:ml-20 hover:cursor-pointer hover:text-red-500 text-center"
          onClick={() => setReporting(true)}
        >
          Report
        </div>
        <div className="flex flex-col">
          <img
            src={wallpaper.imageUrl}
            alt="Image 1"
            className="max-sm:w-5/6 max-sm:ml-8 max-md:ml-12 max-md:w-5/6 max-lg:w-full max-lg:m-0 max-xl:w-9/10 max-xl:ml-10 w-96 max-2xl:ml-20 rounded-2xl h-auto"
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
                src={userdetails.photoURL || usertemp}
                alt="user photo"
              />
              <div className="ml-2  hover:underline">{userdetails.name}</div>
            </div>
          </div>

          <div className="text-5xl max-sm:text-3xl max-md:text-4xl">
            {isEditing ? (
              // Edit Mode
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 mb-2 border-b border-bordergray bg-transparent text-white"
                placeholder="Edit Title"
              />
            ) : (
              wallpaper.title
            )}
          </div>

          <div className="text-2xl mt-5 max-sm:text-lg max-md:text-3xl">
            Description:
          </div>
          <div className="text-xl max-sm:text-lg max-md:text-2xl">
            {isEditing ? (
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 mb-2 border-b border-bordergray bg-transparent text-white"
                placeholder="Edit Description"
              />
            ) : (
              wallpaper.description
            )}
          </div>

          <div className="text-2xl mt-5 max-sm:text-lg max-md:text-3xl">
            Tags:
          </div>
          <div id="display_tags" className="text-gray-300 flex flex-wrap">
            {isEditing ? (
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full p-2 mb-2 border-b border-bordergray bg-transparent text-white"
                placeholder="Edit Tags (comma separated)"
              />
            ) : (
              tags.map((e) => (
                <div
                  className="tag border rounded-md p-1 m-1 mt-2 flex items-center hover:bg-black hover:border-gray-300 hover:text-lg hover:cursor-pointer"
                  onClick={() => redirecttosearch(e)}
                  key={e}
                >
                  <span className="tag-text">#{e}</span>
                </div>
              ))
            )}
          </div>

          <div className="flex items-center justify-evenly mt-7">
                  <div>
                    {/* Edit Button for the uploader */}
                    {user && user.uid === wallpaper.uploader && (
                      <button
                        onClick={() => {
                          handleEdit();
                          setIsEditing(true);
                        }}
                        className="text-center text-2xl text-blue-500 cursor-pointer py-4 px-7 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>

          {/* Save and Cancel Button */}

            <div className="flex flex-col items-center text-center">
              <input
                id="heart"
                type="checkbox"
                checked={liked}
                onChange={toggleLike}
              />
              <label for="heart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-24 h-24"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </label>
              <div className="text-white text-lg">{wallpaper.likes}</div>
            </div>

            <div>
              <button
                id="dropdownDelayButton"
                onClick={downloadimg}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-20 py-5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              >
                Download
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="ml-2 w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
            </div>
          </div>
          {isEditing && (
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSaveEdits}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* Report Functionality */}
  {reporting && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ease-in-out">
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full transform transition-transform duration-300 ease-in-out">
        <h3 className="text-lg font-bold mb-4 text-white">Report Wallpaper</h3>
        {/* Reporting Options */}
        <div className="mb-4">
          <span className="font-semibold text-white">Select a reason for reporting:</span>
          <div className="mt-2">
            {[
              "Copyright Infringement Reports",
              "NSFW (Not Safe For Work) content",
              "Quality Reports",
              "Spam or Misleading Content Reports",
              "Unauthorized Use Reports",
              "Stolen images or those unlawfully obtained",
              "Offensive Content Reports",
              "False Claims Reports",
            ].map((reason, index) => (
              <label key={index} className="block mt-2 text-white">
                <input
                  type="radio"
                  value={reason}
                  checked={reportReason === reason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="mr-2"
                />
                {reason}
              </label>
            ))}
          </div>
        </div>

        {/* Optional Textarea for Additional Comments */}
        {reportReason === "Other" && (
          <textarea
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4"
            rows="4"
            placeholder="Please provide additional details..."
          />
        )}

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              handleReport(); // Handle report logic here
              setReporting(false); // Close the popup
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Submit Report
          </button>
          <button
            onClick={() => setReporting(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )}

  <Footer />
</body>
    );
  } else {
    //for horizontal posts
    return (
      <body className="font-nunito dark text-white">

        {alertMessage && (
          <div className={`fixed top-0 right-0 m-4 p-4 rounded shadow-lg transition-opacity duration-300 ease-in-out ${alertType === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {alertMessage}
          </div>
        )}

        <div className="lg:mx-28 sm:mx-2">

          <div
            className="p-4 m-4 max-lg:hidden hover:cursor-pointer text-2xl text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
            onClick={redirect}
          >
            <div className="flex items-center">
              <img
                className="w-8 h-8 rounded-full"
                src={userdetails.photoURL || usertemp}
                alt="user photo"
              />
              <div className="ml-4  hover:underline">{userdetails.name}</div>
            </div>
          </div>

          <div className="text-5xl max-sm:text-3xl max-md:text-4xl">
            {isEditing ? (
              // Edit Mode
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full p-2 mb-2 border-b border-bordergray bg-transparent text-white"
                placeholder="Edit Title"
              />
            ) : (
              wallpaper.title
            )}
          </div>

          <div className="flex justify-center items-center">
            <div class="max-w-6xl max-sm:m-2 max-md:m-3 max-lg:m-4 min-lg:m-6 flex items-center lg:m-6 rounded-lg dark:bg-gray-800 dark:border-gray-700 relative">
              <img
                class="rounded-lg"
                src={wallpaper.imageUrl}
                alt="wallpaper"
              />
              <div class="absolute top-0 left-0 m-2">
                <div
                  className="inline-block my-1 hover:cursor-pointer hover:text-red-500"
                  onClick={() => setReporting(true)}
                >
                  Report
                </div>
              </div>
              <div class="absolute bottom-0 left-0 ml-2">
                <div className="text-lg">{wallpaper.uploaddate}</div>
              </div>
              <div class="absolute bottom-0 right-0 mr-2">
                <div className="text-lg">
                  Attribution: {wallpaper.attribution}
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-4 m-2 max-lg:block hidden hover:cursor-pointer text-2xl text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
            role="alert"
            onClick={redirect}
          >
            <div className="flex items-center">
              <img
                className="w-8 h-8 rounded-full"
                src={userdetails.photoURL}
                alt="user photo"
              />
              <div className="ml-2  hover:underline">{userdetails.name}</div>
            </div>
          </div>

          <div class="md:flex md:justify-around max-md:grid max-md:grid-cols-2">

            <div class="ml-5">
              <div class="text-4xl max-sm:mx-2 max-md:mx-3 max-lg:mx-4 min-lg:mx-6 lg:mx-6 max-lg:mt-3 max-sm:text-3xl max-md:text-3xl">
                Description:
              </div>
              <div className="text-xl max-sm:mt-0 max-sm:mx-2 max-md:mx-3 max-lg:mx-4 min-lg:mx-6 lg:mx-6 max-lg:mt-2 max-sm:text-lg max-md:text-2xl">
            {isEditing ? (
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full p-2 mb-2 border-b border-bordergray bg-transparent text-white"
                placeholder="Edit Description"
              />
            ) : (
              wallpaper.description
            )}
          </div>
              <div class="text-2xl max-sm:mt-4 max-sm:mx-2 max-md:mx-3 max-lg:mx-4 min-lg:mx-6 lg:mx-6 mt-5 max-sm:text-lg max-md:text-3xl">
                Tags:
              </div>
              <div id="display_tags" className="text-gray-300 max-sm:mt-0 max-sm:mx-2 max-md:mx-3 max-lg:mx-4 min-lg:mx-6 lg:mx-6 flex flex-wrap">
            {isEditing ? (
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full p-2 mb-2 border-b border-bordergray bg-transparent text-white"
                placeholder="Edit Tags (comma separated)"
              />
            ) : (
              tags.map((e) => (
                <div
                  className="tag border rounded-md p-1 m-1 mt-2 flex items-center hover:bg-black hover:border-gray-300 hover:text-lg hover:cursor-pointer"
                  onClick={() => redirecttosearch(e)}
                  key={e}
                >
                  <span className="tag-text">#{e}</span>
                </div>
              ))
            )}
          </div>
            </div>


            <div>
                    {/* Edit Button for the uploader */}
                    {user && user.uid === wallpaper.uploader && (
                      <button
                        onClick={() => {
                          handleEdit();
                          setIsEditing(true);
                        }}
                        className="text-center text-2xl text-blue-500 cursor-pointer py-4 px-7 border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition duration-200"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  

            <div class="mx-auto">
              <input
                id="heart"
                type="checkbox"
                checked={liked}
                onChange={toggleLike}
              />
              <label for="heart">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-24 h-24"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </label>
              <div class="text-white relative left-11 text-lg">{wallpaper.likes}</div>
            </div>

            <div class="md:ml-0 ml-14 mt-4 mr-10 sm:ml-10 ">
              <button
                id="dropdownDelayButton"
                onClick={downloadimg}
                class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg max-md:text-3xl text-xl px-20 py-5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                type="button"
              download>
                Download
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="ml-2 w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-between mt-4">
              <button
                onClick={handleSaveEdits}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          )}

          {reporting && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 transition-opacity duration-300 ease-in-out">
            <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full transform transition-transform duration-300 ease-in-out">
              <h3 className="text-lg font-bold mb-4 text-white">Report Wallpaper</h3>

              {/* Reporting Options */}
              <div className="mb-4">
                <span className="font-semibold text-white">Select a reason for reporting:</span>
                <div className="mt-2">
                  {[
                    "Copyright Infringement Reports",
                    "NSFW (Not Safe For Work) content",
                    "Quality Reports",
                    "Spam or Misleading Content Reports",
                    "Unauthorized Use Reports",
                    "Stolen images or those unlawfully obtained",
                    "Offensive Content Reports",
                    "False Claims Reports",
                  ].map((reason, index) => (
                    <label key={index} className="block mt-2 text-white">
                      <input
                        type="radio"
                        value={reason}
                        checked={reportReason === reason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="mr-2"
                      />
                      {reason}
                    </label>
                  ))}
                </div>
              </div>

              {/* Optional Textarea for Additional Comments */}
              {reportReason === "Other" && (
                <textarea
                  value={additionalComments}
                  onChange={(e) => setAdditionalComments(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  rows="4"
                  placeholder="Please provide additional details..."
                />
              )}

              {/* Action Buttons */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => {
                    handleReport(); // Handle report logic here
                    setReporting(false); // Close the popup
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
                >
                  Submit Report
                </button>
                <button
                  onClick={() => setReporting(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

        )}

        </div>

        <Footer />
      </body>
    );
  }
};

export default Posts;