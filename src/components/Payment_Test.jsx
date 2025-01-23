import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // For tables and formatted data
import AlertComponent from './AlertComponent';
import Footer from "./Footer";
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const PricingPlans = () => {
  const [loading, setLoading] = useState(false); // Loading state for the button
  const db = getFirestore();
  const auth = getAuth();
  const razorpayInstance = useRef(null); // Reference to the Razorpay instance

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (amount, planName) => {
    const user = auth.currentUser;
    if (!user) {
      alert('Please log in to proceed with the payment');
      return;
    }

    setLoading(true); // Set loading state to true when payment is initiated

    // First check if the user has already bought this plan and its API limit
    const isPlanEligible = await checkIfPlanEligible(user.uid, planName);
    if (!isPlanEligible) {
      setLoading(false); // Stop loading after checking eligibility
      return; // Don't proceed if the plan isn't eligible for purchase
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert('Failed to load Razorpay SDK. Please check your network.');
      setLoading(false);
      return;
    }

    const options = {
      key: 'rzp_test_CW6Do4cLHZv1JR', // Replace with your Razorpay test key
      amount: amount * 100, // Razorpay takes the amount in paise
      currency: 'INR', // Updated currency to INR
      name: 'PixGallary',
      description: `${planName} Plan Subscription`,
      handler: async (response) => {
        // This handler is called on successful payment
        alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

        // Proceed with plan purchase and PDF generation
        await handlePlanPurchase(user.uid, planName, amount, response.razorpay_payment_id);
      },
      modalClosed: () => {
        // This function is called when the user closes the Razorpay modal
        // Reset the loading state when the modal is closed
        setLoading(false);
      },
      theme: {
        color: '#1a2847',
      },
    };

    razorpayInstance.current = new window.Razorpay(options);
    razorpayInstance.current.open();

    // Ensure loading state is reset in case of exit or error
    razorpayInstance.current.on('close', () => {
      setLoading(false); // Reset loading if modal is closed (exit/cancel)
    });
  };

  // Function to check if the plan is eligible for purchase (check if it exists and if ApiLimit is not 0)
  const checkIfPlanEligible = async (userId, planName) => {
    try {
      const userDocRef = doc(db, `users/${userId}/ApiManage`, 'settings'); // User settings document path
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const plans = userData.Plans || {};

        // Check if the selected plan exists and its ApiLimit is not 0
        if (plans[planName] && plans[planName].ApiLimit !== 0) {
          alert('You already have bought this plan. Please wait for the API limit to become 0.');
          return false; // Plan is not eligible for purchase
        }

        // If the plan doesn't exist or API Limit is 0, the plan is eligible for purchase
        return true;
      } else {
        console.log('No user document found!');
        alert('User data not found, please try again.');
        return false;
      }
    } catch (error) {
      console.error('Error checking plan eligibility:', error);
      alert('Something went wrong. Please try again.');
      return false;
    }
  };

  // Function to handle the plan purchase
  const handlePlanPurchase = async (userId, planName, amount, paymentId) => {
    try {
      // User document reference
      const userDocRef = doc(db, `users/${userId}/ApiManage`, 'settings');
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const plans = userData.Plans || {};

        // Plan-specific limits and properties
        let apiLimit, hourlyLimit;
        if (planName === 'Pro') {
          apiLimit = 10000;
          hourlyLimit = 500;
        } else if (planName === 'Enterprise') {
          apiLimit = '∞'; // Infinity for Enterprise
          hourlyLimit = '∞'; // Infinity for Enterprise
        } else if (planName === 'Basic') {
          apiLimit = 1000;
          hourlyLimit = 50;
        }

        // Loop through the plans to check for active plans and handle them accordingly
        for (const existingPlanKey in plans) {
          const existingPlan = plans[existingPlanKey];

          if (existingPlan.Status === '1') {
            // If the active plan has ApiLimit: 0, set its Status to '0' (inactive)
            if (existingPlan.ApiLimit === 0) {
              plans[existingPlanKey].Status = '0'; // Mark as inactive
            } else {
              // If there is an active plan with ApiLimit > 0, make the new plan inactive by default
              const newPlan = {
                ApiLimit: apiLimit,
                HourlyLimit: hourlyLimit,
                Price: amount,
                Status: '0', // Set new plan as inactive by default
                CreatedAt: new Date().toISOString(),
                PaymentId: paymentId, // Store the payment ID
              };

              // Update the user's document with the inactive new plan
              plans[planName] = newPlan;

              await updateDoc(userDocRef, {
                Plans: plans,
              });

              setLoading(false); // Stop loading after the operation completes
              downloadBillPDF(amount, planName, paymentId); // Download the bill PDF
              return; // Exit after updating the new inactive plan
            }
          }
        }
        
        const newPlan = {
          ApiLimit: apiLimit,
          HourlyLimit: hourlyLimit,
          Price: amount,
          Status: '1', // Set new plan as active
          CreatedAt: new Date().toISOString(),
          PaymentId: paymentId, // Store the payment ID
        };

        // Update the plans with the newly purchased active plan
        plans[planName] = newPlan;

        await updateDoc(userDocRef, {
          Plans: plans,
        });

        // Proceed with downloading the bill PDF
        downloadBillPDF(amount, planName, paymentId);
        setLoading(false); // Stop loading after the operation completes
      } else {
        console.log('No user document found!');
        alert('User data not found, please try again.');
        setLoading(false);
      }

    } catch (error) {
      console.error('Error handling plan purchase:', error);
      alert('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const downloadBillPDF = (amount, planName, paymentId) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(22);
    doc.text('Payment Invoice', 20, 20);
    
    // Add details
    doc.setFontSize(12);
    doc.text(`Plan: ${planName}`, 20, 40);
    doc.text(`Amount Paid: ₹${amount}`, 20, 50);
    doc.text(`Payment ID: ${paymentId}`, 20, 60);
    
    // Add additional details like date
    const date = new Date().toLocaleDateString();
    doc.text(`Date: ${date}`, 20, 70);

    // Save the generated PDF
    doc.save(`invoice_${planName}_${paymentId}.pdf`);
  };

  return (
    <div>
      <div className="flex flex-col items-center mt-10">
        <AlertComponent />
        <br /><br />
        <h1 className="text-3xl font-bold mb-8 text-white">
          Flexible pricing plans for your <span className="text-orange-500">growing team</span>
        </h1>
        <div className="grid md:grid-cols-4 gap-8">
          {/* Free Plan */}
          <div className="bg-[#1f2937] shadow-lg rounded-lg p-6 text-center text-white transform transition-transform duration-300 hover:scale-y-110">
            <h2 className="text-xl font-semibold mb-4 text-blue-500">FREE</h2>
            <p className="text-4xl font-bold mb-4">₹0</p>
            <ul className="text-white mb-6 text-left space-y-2 list-disc pl-5 list-blue-500">
              <li>Call Limit: <strong>100 calls</strong></li>
              <li>Rate Limit: Max <strong>5 calls per hour</strong></li>
              <li>Features: Basic search</li>
              <li>Restrictions: Low-res images only</li>
            </ul>
          </div>

          {/* Basic Plan */}
          <div className="bg-[#1f2937] shadow-lg rounded-lg p-6 text-center text-white transform transition-transform duration-300 hover:scale-y-110">
            <h2 className="text-xl font-semibold mb-4 text-green-500">BASIC</h2>
            <p className="text-4xl font-bold mb-4">₹500</p>
            <ul className="text-white mb-6 text-left space-y-2 list-disc pl-5 list-green-500">
              <li>Call Limit: <strong>1,000 calls</strong></li>
              <li>Rate Limit: Max <strong>50 calls per hour</strong></li>
              <li>Features: Standard search, medium-res images</li>
              <li>Restrictions: Limited high-res images, basic filtering</li>
            </ul>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handlePayment(500, 'Basic')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'BUY NOW'}
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#1f2937] shadow-lg rounded-lg p-6 text-center text-white transform transition-transform duration-300 hover:scale-y-110">
            <h2 className="text-xl font-semibold mb-4 text-red-500">PRO</h2>
            <p className="text-4xl font-bold mb-4">₹3000</p>
            <ul className="text-white mb-6 text-left space-y-2 list-disc pl-5 list-red-500">
              <li>Call Limit: <strong>10,000 calls</strong></li>
              <li>Rate Limit: Max <strong>500 calls per hour</strong></li>
              <li>Features: Full resolution images, advanced filters</li>
              <li>Restrictions: Images below <strong>10 MB</strong> size limit</li>
            </ul>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handlePayment(3000, 'Pro')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'BUY NOW'}
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#1f2937] shadow-lg rounded-lg p-6 text-center text-white transform transition-transform duration-300 hover:scale-y-110">
            <h2 className="text-xl font-semibold mb-4 text-yellow-500">ENTERPRISE</h2>
            <p className="text-4xl font-bold mb-4">₹10000</p>
            <ul className="text-white mb-6 text-left space-y-2 list-disc pl-5 list-yellow-500">
              <li>Call Limit: <strong>50,000+ calls</strong></li>
              <li>Rate Limit: <strong>No hourly cap</strong></li>
              <li>Features: Highest resolution images, full filtering </li>
              <li>Restrictions: None; full access to all API features</li>
            </ul>
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
              onClick={() => handlePayment(10000, 'Enterprise')}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'BUY NOW'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPlans;
