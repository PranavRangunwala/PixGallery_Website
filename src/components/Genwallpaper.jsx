import React from 'react'
import Footer from './Footer'
import dalle from '../assets/siteslogo/dalle.png'
import ideogram from '../assets/siteslogo/ideogram.jpeg'
import midjourney from '../assets/siteslogo/midjourney.png'
import stablediff from '../assets/siteslogo/stablediff.jpg'

const Genwallpaper = () => {

    const linkdalle = () => {
        const url = 'https://example.com';
        window.open(url, '_blank');
      };


  return (
    <body class="dark text-white" >

        <h1 className='p-4 flex justify-center text-4xl text-center font-nunito m-4'>Here are some sites to generate a wallpaper.
        <br /> Don't forget to upload good wallpapers to out website for others to find and help our community grow.
        </h1>
        
        <div class="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-3 gap-1">

            <div onClick={() => { const url = 'https://openai.com/research/dall-e'; window.open(url, '_blank'); }} class="max-w-sm m-8 hover:cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <img class="rounded-t-lg" src={dalle} alt="Dall·e" />
                    </div>
                    <div class="p-5 text-center">
                        <div>
                            <h5 class="mb-2 mt-3 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
                                Dall·e
                            </h5>
                        </div>
                    </div>
                </div>

                <div onClick={() => { const url = 'https://ideogram.ai'; window.open(url, '_blank'); }} class="max-w-sm m-8 hover:cursor-pointer bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <img class="rounded-t-lg" src={ideogram} alt="Ideogram" />
                    </div>
                    <div class="p-5 text-center">
                        <div>
                            <h5 class="mb-2 mt-3 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
                                Ideogram
                            </h5>
                        </div>
                    </div>
                </div>
                
                <div onClick={() => { const url = 'https://www.midjourney.com/home'; window.open(url, '_blank'); }} class="max-w-sm hover:cursor-pointer m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <img class="rounded-t-lg" src={midjourney} alt="Mid Journey" />
                    </div>
                    <div class="p-5 text-center">
                        <div>
                            <h5 class="mb-2  mt-3 text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
                                Mid journey
                            </h5>
                        </div>
                    </div>
                </div>

                <div onClick={() => { const url = 'https://stablediffusionweb.com/#ai-image-generator'; window.open(url, '_blank'); }} class="max-w-sm hover:cursor-pointer m-8 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div>
                        <img class="rounded-t-lg" src={stablediff} alt="Stable diffusion" />
                    </div>
                    <div class="p-5 text-center">
                        <div>
                            <h5 class="mb-2 mt-3  text-2xl text-center font-bold tracking-tight text-gray-900 dark:text-white">
                                Stable Diffusion
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            <Footer/>
    </body>
  )
}

export default Genwallpaper