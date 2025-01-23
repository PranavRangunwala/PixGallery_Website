import React from 'react'
import Footer from './Footer'
import btc from '../assets/cryptoadd/btc.png'
import eth from '../assets/cryptoadd/eth.png'
import bnb from '../assets/cryptoadd/bnb.png'
import xrp from '../assets/cryptoadd/xrp.png'
import usdt from '../assets/cryptoadd/usdt.png'
import doge from '../assets/cryptoadd/doge.png'

const Donate = () => {
    $(document).ready(() => { 
        $('#btccpy').click(() => { 
            const textToCopy = "bc1qp460jqrw0q8acl5ng3k45gdtvwvry450awm67z";  
            navigator.clipboard.writeText(textToCopy).then(function() {
                //console.log("coppied");
                $('#btcdone').show(); // Show the div
                setTimeout(function() {
                  $('#btcdone').fadeOut(500, function() {
                    $('#btcdone').hide(); // Hide the div
                  });
                }, 3000); // 5s timeout for hiding
            }).catch(function(err) {
                console.error('Unable to copy text: ', err);
            });  
        })
        $('#ethcpy').click(() => { 
            const textToCopy = "0x9DAf8CF625Cd3ADb4048CAAa5468Bc46f33a4F81";  
            navigator.clipboard.writeText(textToCopy).then(function() {
                console.log("coppied");
                $('#ethdone').show(); // Show the div
                setTimeout(function() {
                  $('#ethdone').fadeOut(500, function() {
                    $('#ethdone').hide(); // Hide the div
                  });
                }, 3000); // 5s timeout for hiding
            }).catch(function(err) {
                console.error('Unable to copy text: ', err);
            });  
        })
        $('#bnbcpy').click(() => { 
            const textToCopy = "bnb1p7a2jylgyd58r6qm63dwzzk0ykhg7rmndmzsde";  
            navigator.clipboard.writeText(textToCopy).then(function() {
                console.log("coppied")
                $('#bnbdone').show(); // Show the div
                setTimeout(function() {
                  $('#bnbdone').fadeOut(500, function() {
                    $('#bnbdone').hide(); // Hide the div
                  });
                }, 3000); // 5s timeout for hiding
            }).catch(function(err) {
                console.error('Unable to copy text: ', err);
            });  
        })
        $('#xrpcpy').click(() => { 
            const textToCopy = "rpajti3t4hNGLvRUhEF8KCmezZCPD7KNYc";  
            navigator.clipboard.writeText(textToCopy).then(function() {
                console.log("coppied")
                $('#xrpdone').show(); // Show the div
                setTimeout(function() {
                  $('#xrpdone').fadeOut(500, function() {
                    $('#xrpdone').hide(); // Hide the div
                  });
                }, 3000); // 5s timeout for hidxrp
            }).catch(function(err) {
                console.error('Unable to copy text: ', err);
            });  
        })
        $('#usdtcpy').click(() => { 
            const textToCopy = "0x9DAf8CF625Cd3ADb4048CAAa5468Bc46f33a4F81";  
            navigator.clipboard.writeText(textToCopy).then(function() {
                console.log("coppied")
                $('#usdtdone').show(); // Show the div
                setTimeout(function() {
                  $('#usdtdone').fadeOut(500, function() {
                    $('#usdtdone').hide(); // Hide the div
                  });
                }, 3000); // 5s timeout for hiding
            }).catch(function(err) {
                console.error('Unable to copy text: ', err);
            });  
        })
        $('#dogecpy').click(() => { 
            const textToCopy = "DSXwFryHgkmwtTE1mY4Fad6aF9k3dAp7hW";  
            navigator.clipboard.writeText(textToCopy).then(function() {
                console.log("coppied")
                $('#dogedone').show(); // Show the div
                setTimeout(function() {
                  $('#dogedone').fadeOut(500, function() {
                    $('#dogedone').hide(); // Hide the div
                  });
                }, 3000); // 5s timeout for hiding
            }).catch(function(err) {
                console.error('Unable to copy text: ', err);
            });  
        })
    })

  return (
    <body class="dark text-white" >

        <h1 className='p-4 flex text-green-400 justify-center text-4xl m-4 font-nunito'>Thank you so much for your generous donation! Your support is greatly appreciated and helps us continue to thrive and serve our community. We couldn't do it without people like you. Thanks again for making a difference!</h1>
        
        
        <div class="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-1">
            
            <div class="max-w-sm m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="rounded-t-lg" src={btc} alt="bc1qp460jqrw0q8acl5ng3k45gdtvwvry450awm67z" />
                </div>
                <div class="p-5 text-center">
                    <div>
                        <h5 class="mb-2 mt-3 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
                            Bitcoin
                        </h5>
                    </div>
                    <button id='btccpy' class="inline-flex items-center mt-4 px-3 py-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Copy address
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </button>
                    <div id='btcdone' className='hidden'>
                        <p className='inline-block items-center mt-4 mr-1'>Copied</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    
                </div>
            </div>

            <div class="max-w-sm m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="rounded-t-lg" src={eth} alt="0x9DAf8CF625Cd3ADb4048CAAa5468Bc46f33a4F81" />
                </div>
                <div class="p-5 text-center">
                    <div>
                        <h5 class="mb-2 mt-3  text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">Ethereum</h5>
                    </div>
                    <button id='ethcpy' class="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Copy address
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </button>
                    <div id='ethdone' className='hidden'>
                        <p className='inline-block items-center mt-4 mr-1'>Copied</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="max-w-sm m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="rounded-t-lg" src={bnb} alt="bnb1p7a2jylgyd58r6qm63dwzzk0ykhg7rmndmzsde" />
                </div>
                <div class="p-5 text-center">
                    <div>
                        <h5 class="mb-2 text-2xl text-center  font-bold tracking-tight text-gray-900 dark:text-white">BNB</h5>
                    </div>
                    <button id='bnbcpy' class="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Copy address
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </button>
                    <div id='bnbdone' className='hidden'>
                        <p className='inline-block items-center mt-4 mr-1'>Copied</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="max-w-sm m-8 pb-3 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="rounded-t-lg" src={xrp} alt="rpajti3t4hNGLvRUhEF8KCmezZCPD7KNYc" />
                </div>
                <div class="p-5 text-center">
                    <div>
                        <h5 class="mb-2  text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">XRP</h5>
                    </div>
                    <button id='xrpcpy' class="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Copy address
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </button>
                    <div id='xrpdone' className='hidden'>
                        <p className='inline-block items-center mt-4 mr-1'>Copied</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="max-w-sm m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="rounded-t-lg" src={usdt} alt="0x9DAf8CF625Cd3ADb4048CAAa5468Bc46f33a4F81" />
                </div>
                <div class="p-5 text-center">
                    <div>
                        <h5 class="mb-2 mt-3 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">USDT</h5>
                    </div>
                    <button id='usdtcpy' class="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Copy address
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </button>
                    <div id='usdtdone' className='hidden'>
                        <p className='inline-block items-center mt-4 mr-1'>Copied</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div class="max-w-sm m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <div>
                    <img class="rounded-t-lg" src={doge} alt="DSXwFryHgkmwtTE1mY4Fad6aF9k3dAp7hW" />
                </div>
                <div class="p-5 text-center">
                    <div>
                        <h5 class="mb-2 mt-3 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">DOGE</h5>
                    </div>
                    <button id='dogecpy' class="inline-flex items-center mt-4 px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Copy address
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="ml-1 w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                    </button>
                    <div id='dogedone' className='hidden'>
                        <p className='inline-block items-center mt-4 mr-1'>Copied</p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="inline-block w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </body>
  )
}

export default Donate