import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, imgdb } from '../../config/firebase';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../../config/firebase';
import { v4 } from 'uuid';
import Footer from './Footer';
import shortid from 'shortid';
import { Link } from 'react-router-dom';

const UploadImage = () => {
  const [img, setImg] = useState('');
  const [imgname, setImgName] = useState('');
  const [imgdata, setImgData] = useState({
    imgName: '',
    imgDescription: '',
    imgTags: '',
    imgSource: '',
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [user] = useAuthState(auth);
  const [tagsread, setTagsRead] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [postID, setPostID] = useState(null)
  const [isVisible, setIsVisible] = useState(false);

  const allowedExtensions = ['png', 'jpg', 'jpeg', 'heif'];
  const aggrement = 'By uploading an image to our website, you agree that the image is your original creation, and you possess all necessary rights, including but not limited to copyright, to upload and share the image. You hereby grant GeneratedWalls a perpetual, irrevocable, worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, modify, adapt, publicly perform, and publicly display the uploaded image on our website and associated platforms. You further represent and warrant that the uploaded image does not infringe upon any third-party rights, including intellectual property rights, and is not stolen or unlawfully obtained. Additionally, you affirm that the uploaded image is not NSFW (Not Safe For Work) and does not contain nude, explicit, or sexually suggestive content. GeneratedWalls disclaims any liability for any claims or actions arising out of the use or display of the uploaded image. We reserve the right to remove any content that violates these terms without notice.'
  
  const handleTagInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const trimmedValue = inputValue.trim().replace(/\s+/g, ''); // Remove spaces
      if (trimmedValue) {
        setTagsRead((prevTags) => [...prevTags, trimmedValue]); // Add the tag to the array
        setInputValue('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTagsRead((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };
  function getFileExtension(filename) {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2); // Extract the part after the last dot
  }

  const openmodal = () => { 
    $(document).ready(() => { 
      $('#static-modal').removeClass("hidden").addClass("block");
     })
   }
   const closemodal = () => { 
    $(document).ready(() => { 
      $('#static-modal').removeClass("block").addClass("hidden");
     })
   }

  function getImageOrientation(width, height) {
    if (width > height) {
      return "horizontal";
    } else if (height > width) {
      return "vertical";
    } else {
      return "vertical"; // If width and height are equal, it's a square
    }
  }

  const uploadtodb = async () => {
    try {
          closemodal();
          if (!img || !imgname || !imgdata.imgName || !imgdata.imgDescription || !tagsread.length || !imgdata.imgSource) {
            $('#warningsize').show();
            $('#errmsg').text("Fill all the  details, don't forget to attach image.");
            return;
          }

          const imgRef = ref(imgdb, `images/${v4()}`);
          const uuid = shortid.generate();
          setPostID(uuid);
          const uploadTask = uploadBytesResumable(imgRef, img);
            const imgElement = new Image();
            imgElement.src = URL.createObjectURL(img);

            // Wait for the image to load
            await new Promise((resolve) => {
              imgElement.onload = resolve;
            });

            const height = imgElement.naturalHeight;
            const width = imgElement.naturalWidth;

            const sizemb = (img.size /(1024*1024)).toFixed(1);
            if (sizemb>11) {
              $('#warningsize').show();
              $('#errmsg').text('Size is more than 11MB')
              return;
            }

            const fileex = getFileExtension(imgname);

            if (!allowedExtensions.includes(fileex.toLowerCase())) {
              $('#warningsize').show();
              $('#errmsg').text('Invalid file extension. Allowed extensions are: ' + allowedExtensions.join(', '));
              return;
            }

            const currentDate = new Date();
            const day = currentDate.getDate();
            const month = currentDate.getMonth() + 1; // Adding 1 because months are 0-based
            const year = currentDate.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;
            const useruploader = user.uid;

            $('#warningsize').hide();

            const orien = getImageOrientation(width,height);

          uploadTask.on('state_changed', (snapshot) => {
            // Calculate the upload progress percentage
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          }, (error) => {
            // Handle errors
            console.error('Error uploading image: ', error);
            $('#warningsize').show();
            $('#errmsg').text('Error uploading image')
            return;
          }, async () => {
            // Handle successful upload
            console.log('Image uploaded successfully');

            // Create a reference to the user's document in Firestore
            const userRef = doc(db, 'users', user.uid);

            // Create a reference to the 'wallpapers' collection within the user's document
            const wallpapersRef = collection(userRef, 'wallpapers');
            const tagscomma = tagsread.join(', ');
            // Data to be stored in the database
            const imageData = {
              title: imgdata.imgName,
              description: imgdata.imgDescription,
              tags: tagscomma,
              attribution: imgdata.imgSource,
              imageUrl: '', // You'll set this value when the upload is complete
              resolution: `${width}x${height}`,
              likes: 0,
              uploaddate: formattedDate,
              orientation: orien,
              sizeinmb: sizemb,
              extension: fileex,
              uid:uuid,
              uploader:useruploader,
              docid: null 
            };

            // Add a new document in the 'wallpapers' collection
            const docRef = await addDoc(wallpapersRef, imageData);
            
            // Get the ID of the newly created document
            const wallpaperId = docRef.id;
      
            // Update the imageData with the imageUrl based on the storage location
            const downloadURL = await getDownloadURL(imgRef);
            imageData.imageUrl = downloadURL;
            imageData.docid = wallpaperId; 
      
            // Update the document with the imageURL
            await updateDoc(doc(wallpapersRef, wallpaperId), { imageUrl: downloadURL ,docid : wallpaperId});
              setIsVisible(true);
          });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <body className="dark text-white">
        {/* unhide this wiht block when upload button is clicked and change the progress bar value */}
                {/* upload progress bar */}
                <div className={`max-sm:mx-5 max-md:mx-12 max-lg:mx-16 min-lg:mx-10 lg:mx-40 ${uploadProgress === 0 ? 'hidden' : ''}`}>
                <div class="flex justify-between mb-1">
                    <span class="text-base font-medium text-blue-700 dark:text-white">{uploadProgress == 100 ? 'Upload Success' : 'Uploading...'}</span>
                    {isVisible && (
        <Link to={`/posts/${postID}`} className="text-white hover:text-blue-700">See uploaded post</Link>
      )}
                  <span class="text-sm font-medium text-blue-700 dark:text-white">{uploadProgress.toFixed(2)}%</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div class="bg-blue-600 h-2.5 rounded-full" style={{width: `${uploadProgress}%`}}>
                    </div>
                </div>
                </div>

{/* popup modal */}
<div id="static-modal"  tabIndex="-1"  className="hidden fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 justify-center items-center w-full md:max-w-md">
              <div class="relative p-4 w-full max-w-2xl max-h-full">

                  <div class="relative bg-white rounded-lg shadow dark:bg-zinc-800">

                      <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                              Terms and Conditions
                          </h3>
                          <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                              <svg class="w-3 h-3" onClick={closemodal}  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                              </svg>
                              <span class="sr-only">Close modal</span>
                          </button>
                      </div>
                      <div class="p-4 md:p-5 space-y-4">
                          <p class="max-md:text-sm leading-relaxed text-gray-500 dark:text-gray-400">
                            {aggrement}
                          </p>
                      </div>
                      <div class="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                          <button onClick={uploadtodb} type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">I accept</button>
                          <button onClick={closemodal} type="button" class="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">Decline</button>
                      </div>
                  </div>
              </div>
          </div>

    <div id="warningsize" className='hidden'>
    {/* $('#myElement').toggleClass('hidden block'); */}
        <div class="flex items-center justify-center p-4 m-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Info</span>
            <div  class="text-center">
                <span  class="font-medium">Warning alert!</span> <p id='errmsg'></p>
            </div>
        </div>
    </div>


    <h1 className='p-4 flex justify-center text-4xl font-nunito my-4'>Upload Image</h1>
    
  
    <div class="container mx-auto">
        <div class="flex md:flex-row flex-col relative">

              {/* component left */}
            <div class="  w-full md:w-1/2 p-1 relative">
                <div class="flex  items-center justify-center w-full">
            <div class="flex items-center justify-center w-2/3 h-3/4">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-full py-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50  dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                    <div class="flex  flex-col items-center justify-center pt-5 pb-6">
                        <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, JPEG or HEIF (MAX. 5000x5000px)</p>
                        <p>{img ? imgname : ''}</p>
                    </div>
                    <input id="dropzone-file" type="file" class="hidden" onChange={(e)=>{setImg(e.target.files[0]); setImgName(e.target.files[0].name)}} />
                </label>
            </div>
        </div>
                <div class="h-full w-0.5 bg-gray-500 absolute hidden md:block top-0 right-0"></div>
            </div>

              {/* component right */}
            <div class="w-full md:w-1/2 p-4 md:m-0">
            <div className='m-2'>
            <form>
                {/* Image name */}
                <div class="relative z-0 w-full mb-6 group">
                    <input type="text" name="imgname" id="imgname" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="" required value={imgdata.imgName} // Set the value from imgdata
                    onChange={(e) => {
                        const newName = e.target.value;
                        setImgData((prevData) => ({
                        ...prevData,
                        imgName: newName, // Update imgName attribute in imgdata
                        }));
                    }}/>
                    <label for="imgname" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Image Name</label>
                </div>
                {/* Image Description */}
                <div class="relative z-0 w-full mb-6 group">
                    <textarea
                        type="text"
                        name="imgdesc"
                        id="imgdesc"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        required
                        value={imgdata.imgDescription}
                        onChange={(e) => {
                            const newDescription = e.target.value;
                            setImgData((prevData) => ({
                                ...prevData,
                                imgDescription: newDescription,
                            }));
                        }}
                    />
                    <label for="imgdesc" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Image Description</label>
                </div>
        {/* Tag input */}
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            id="imgtags"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=""
            value={inputValue}
            required
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleTagInput}
          />
          <label
            htmlFor="imgtags"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Type and press Enter to add tags
          </label>
          <div id="display_tags" className="text-gray-500 flex flex-wrap">
            {tagsread.map((tag) => (
              <div key={tag} className="tag border rounded-md p-1 m-1 mt-2 flex items-center">
                <span className="tag-text">#{tag}</span>
                <button
                  className="remove-tag ml-2"
                  onClick={() => handleRemoveTag(tag)}
                >
                  &nbsp;×
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Source or Attribution */}
        <div class="relative z-0 w-full mb-6 group">
                    <input
                        type="text"
                        name="imgsource"
                        id="imgsource"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        required
                        value={imgdata.imgSource}
                        onChange={(e) => {
                            const newSource = e.target.value;
                            setImgData((prevData) => ({
                                ...prevData,
                                imgSource: newSource,
                            }));
                        }}
                    />
                    <label for="imgsource" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Source or Attribution</label>
                </div>

                </form>
        </div>
        
        <div class="flex justify-center my-2">
            (Note: Maximum image size is 11 MB)
        </div>

            {/* Uplaod btn */}
            {auth && user ? (
                <div class="flex justify-center my-6 mt-10" id="btnupload" onClick={openmodal}>
                    <a href="#_" class="relative items-center justify-start inline-block px-5 py-3 overflow-hidden font-bold rounded-full group">
                    <span class="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
                    <span class="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-white opacity-100 group-hover:-translate-x-8"></span>
                    <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-gray-900">Upload</span>
                    <span class="absolute inset-0 border-2 border-white rounded-full"></span>
                    </a>
                </div>
                ) : (
                <h1 className='flex justify-center text-3xl mt-10'>You need to be logged in</h1>
                )}
            </div>
        </div>
    </div>
    <Footer/>
                    
      </body>
      {/* ...rest of your code */}
    </>
  );
};

export default UploadImage;