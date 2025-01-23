import React from 'react'
import Footer from './Footer'
import { Link } from 'react-router-dom';

const Contactme = () => {

    const don = () => {
        const url = 'https://example.com';
        window.open(url, '_blank');
      };

  return (
    <body class="dark text-white" >

        <h1 className='p-4 flex justify-center text-4xl text-center font-nunito mt-4'>
            This website is made for demo , a group project.
            <br />
            For any question, inquiry, suggestions, contact me:
        </h1>
        <div>
            <Link to='/donate' className=' p-0 hover:cursor-pointer hover:underline flex justify-center text-xl text-center font-nunito'>
                Buy me a coffee?
            </Link>
        </div>
        <div>
            <h1 className='p-4 flex justify-center text-3xl text-center font-nunito m-4'>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 m-1 h-7">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                mail : 21bmiit069@gmail.com<br></br>
                21bmiit123@gmail.com
            </h1>
            
        </div>
        {/* <a href='https://www.instagram.com/preetramsha/' target='_blank'>
            <h1 className='p-4 hover:underline hover:cursor-pointer flex justify-center text-4xl text-center font-nunito m-4'>
                Instagram : @preetramsha 
            </h1>
        </a> */}
        <div className='relative' style={{top:'16rem'}}>
            <Footer/>
        </div>
    </body>
  )
}

export default Contactme