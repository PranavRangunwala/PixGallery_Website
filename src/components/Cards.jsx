import React from 'react';

const Cards = (props) => {
  const redirect = () => {
    window.location = `/posts/${props.uid}`;
  };

  const imageSizeStyle = {
    width: '603px', // Set a fixed width
    height: '350px', // Set a fixed height
  };

  if (props.orientation === 'vertical') {
    return (
      <div className="group hover:cursor-pointer relative" onClick={redirect}>
        <div className="w-full aspect-h-1 aspect-w-1 overflow-hidden rounded-md bg-gray-600 group-hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 absolute opacity-90 top-2 left-2 text-red-700"
            style={{ textShadow: '0 1.2px 1.2px rgba(0, 0, 0, 0.8)' }}
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <div
            className={`text-white text-xs absolute top-8 ${
              props.likes > 9 ? 'left-3' : 'left-4'
            } textborder`}
            style={{ textShadow: '0 1.2px 1.2px rgba(0, 0, 0, 0.8)' }}
          >
            {props.likes}
          </div>
          <img
            src={props.imgUrl}
            alt="Wallpaper"
            className="object-cover object-center"
            style={imageSizeStyle}
          />
          <div className="absolute top-2 right-2">
            <div className="bg-red-700 p-1 px-2 rounded-lg text-white text-xs opacity-90">
              {props.reso}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="text-sm m-4">{props.name}</div>
          </div>
        </div>
      </div>
    );
  } else {
    // For horizontal wallpapers
    return (
      <div className="group hover:cursor-pointer relative" onClick={redirect}>
        <div className="group-hover:opacity-80">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 absolute opacity-90 top-2 left-2 text-red-700"
            style={{ textShadow: '0 1.2px 1.2px rgba(0, 0, 0, 0.8)' }}
          >
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
          <div
            className={`text-white text-xs absolute top-8 ${
              props.likes > 9 ? 'left-3' : 'left-4'
            } textborder`}
            style={{ textShadow: '0 1.2px 1.2px rgba(0, 0, 0, 0.8)' }}
          >
            {props.likes}
          </div>
          <div className="max-w-full rounded-lg dark:bg-gray-800 dark:border-gray-700">
            <img
              className="rounded-lg object-cover object-center"
              src={props.imgUrl}
              alt={props.name}
              style={imageSizeStyle}
            />
          </div>
          <div className="absolute top-2 right-2">
            <div className="bg-red-700 p-1 px-2 rounded-lg text-white text-xs opacity-90">
              {props.reso}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div
              className="text-lg m-2"
              style={{ textShadow: '0 1.2px 1.2px rgba(0, 0, 0, 0.8)' }}
            >
              {props.name}
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Cards;
