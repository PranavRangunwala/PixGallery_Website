import React from 'react'
import Footer from './Footer'
const Feedback = () => {
  const redirect = (e) => {
    e.preventDefault();
    window.open('https://forms.gle/5TCaeFo6jATQuboy6', '_blank');
    //make this work with LINK in react-router and not this. as this will reload the page
  };
  return (
    <body class="dark text-white" >

        <h1 className='p-4 flex justify-center text-4xl font-nunito m-4'>Your feedback is invaluable to us! Please share your thoughts on how we can enhance, add, or remove features to make our website better.</h1>
        <div class="flex mt-8 justify-center">
            <button onClick={redirect} type="button" class="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 mr-2 mb-2">
            <svg class="w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 19">
                <path fill-rule="evenodd" d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z" clip-rule="evenodd"/>
            </svg>
            Write a feedback with google form
            </button>
        </div>
        <div className='relative' style={{top:'20.5rem'}}>
            <Footer/>
        </div>
    </body>
  )
}

export default Feedback