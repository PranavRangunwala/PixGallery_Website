import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import { signOut} from 'firebase/auth';
import { auth } from '../../config/firebase';

const Logout = () => {
  const navigate = useNavigate();
  try {
    signOut(auth);
  } catch (error) {
    alert(error.message);
  }
  useEffect(() => {
    // Redirect to /home after 5 seconds
    const redirectTimeout = setTimeout(() => {
      navigate('/');
    }, 3000);
    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);
  return (
    <>
      <body className="dark text-white">
        <h1 className="p-4 flex justify-center text-4xl font-nunito my-4">You successfully logged out</h1>
        <div className="relative" style={{ top: '28rem' }}>
          <Footer />
        </div>
      </body>
    </>
  );
};

export default Logout;
