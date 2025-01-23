import React, { useState } from 'react';
import './yourStyles.css'; // Import your CSS file for styles
import '@fortawesome/fontawesome-free/css/all.min.css';


const AlertComponent = () => {
  const [showWarning, setShowWarning] = useState(true);

  return (
    <div className="row">
      {showWarning && (
        <div className="col-sm-12">
          <div
            className="relative flex items-center p-4 border-l-4 border-yellow-500 text-yellow-700 transition duration-500 cursor-pointer hover:bg-yellow-300"
            role="alert"
            style={{
              boxShadow: '0px 0px 2px #ffb103',
              color: '#ffb103',
              textShadow: '2px 1px #00040a',
              backgroundColor: 'rgba(255, 255, 0, 0.065)', // Semi-transparent yellow
            }}
          >
            <i className="start-icon fa fa-exclamation-triangle blink text-xl mr-2"></i>
            <strong className="font-semibold">Warning!</strong>
            <span className="ml-2 mr-2"> If You Have Already Buy Plan And Buying Again Then You Can Manage Which Plan To Active And DeActive , It Is Totally On You And Only One Plan Will Be Active At A Time.  </span>
            <span></span>
            <button
              type="button"
              className="text-yellow-500 hover:text-yellow-700 "
              onClick={() => setShowWarning(false)}
            >
              <i className="fa fa-times warning text-xl"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertComponent;
