import React from 'react';
import Footer from './Footer'

const ApiDocs = () => (
  <div className="bg-[#111827] text-gray-200 min-h-screen p-10 ">
    <h1 className="text-4xl font-bold mb-6 text-gray-100 text-green-500">Wallpaper API Documentation</h1>
    <p className="mb-8 text-gray-300">
      This documentation covers how to use the Wallpaper API, including authentication, endpoints, parameters, and example requests and responses.
    </p>

    {/* Authentication Section */}
    <div className="bg-[#1f2937] p-6 mb-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-500">Authentication</h2>

      <p>All API requests require authentication via <code className="bg-gray-800 p-1 rounded">uid</code> and <code className="bg-gray-800 p-1 rounded">secretKey</code> parameters, passed as query parameters.</p>
    </div>

    {/* Endpoint: GET /wallpapers */}
    <div className="bg-[#1f2937] p-6 mb-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-500">GET /wallpapers</h2>
      <p className="mb-4">Fetches wallpapers based on filters and user plan limits.</p>

      {/* Parameters Table */}
      <h3 className="text-xl font-semibold mb-2">Query Parameters</h3>
      <div className="overflow-auto">
        <table className="min-w-full bg-[#111827] border border-gray-700 rounded">
          <thead>
            <tr>
              <th className="border-b border-gray-700 px-4 py-2 text-left">Parameter</th>
              <th className="border-b border-gray-700 px-4 py-2 text-left">Type</th>
              <th className="border-b border-gray-700 px-4 py-2 text-left">Description</th>
              <th className="border-b border-gray-700 px-4 py-2 text-left">Required</th>
            </tr>
          </thead>
          <tbody className="text-gray-300">
            <tr>
              <td className="border-b border-gray-700 px-4 py-2">uid</td>
              <td className="border-b border-gray-700 px-4 py-2">string</td>
              <td className="border-b border-gray-700 px-4 py-2">User ID for authentication</td>
              <td className="border-b border-gray-700 px-4 py-2">Yes</td>
            </tr>
            <tr>
              <td className="border-b border-gray-700 px-4 py-2">Secret Key</td>
              <td className="border-b border-gray-700 px-4 py-2">string</td>
              <td className="border-b border-gray-700 px-4 py-2">Secret Key for authentication</td>
              <td className="border-b border-gray-700 px-4 py-2">Yes</td>
            </tr>
            <tr>
              <td className="border-b border-gray-700 px-4 py-2">search</td>
              <td className="border-b border-gray-700 px-4 py-2">string</td>
              <td className="border-b border-gray-700 px-4 py-2">Query String For Getting Desired Result</td>
              <td className="border-b border-gray-700 px-4 py-2">Yes</td>
            </tr>
            <tr>
              <td className="border-b border-gray-700 px-4 py-2">resolution</td>
              <td className="border-b border-gray-700 px-4 py-2">string</td>
              <td className="border-b border-gray-700 px-4 py-2">Query String For Getting Desired resolution</td>
              <td className="border-b border-gray-700 px-4 py-2">no</td>
            </tr>
            <tr>
              <td className="border-b border-gray-700 px-4 py-2">tags</td>
              <td className="border-b border-gray-700 px-4 py-2">string</td>
              <td className="border-b border-gray-700 px-4 py-2">Query String For Getting Desired Tags.</td>
              <td className="border-b border-gray-700 px-4 py-2">no</td>
            </tr>
            <tr>
              <td className="border-b border-gray-700 px-4 py-2">orientation</td>
              <td className="border-b border-gray-700 px-4 py-2">string</td>
              <td className="border-b border-gray-700 px-4 py-2">Query String For Getting Desired Tags</td>
              <td className="border-b border-gray-700 px-4 py-2">no</td>
            </tr>
            {/* Add more rows for each parameter */}
          </tbody>
        </table>
      </div>

      {/* Example Request */}
      <h3 className="text-2xl font-semibold mb-4 text-green-500">Example Request</h3>
      <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-gray-300">
        GET https://pix-gallary-api.vercel.app/wallpapers?uid=user123&secretKey=abc123&search=beach
      </pre>

      {/* Example Response */}
      <h3 className="text-2xl font-semibold mb-4 text-green-500">Example Response</h3>
      <pre className="bg-gray-900 p-4 rounded-lg overflow-auto text-gray-300">
{`{
  "wallpapers": [
    {
      "uid": "user123",
      "title": "Beach Sunset",
      "resolution": "1920x1080",
      "imageUrl": "https://example.com/beach.jpg"
    }
  ]
}`}
      </pre>
    </div>

    {/* Error Codes Section */}
    <div className="bg-[#1f2937] p-6 mb-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-500">Error Codes</h2>
      <table className="min-w-full bg-[#111827] border border-gray-700 rounded">
        <thead>
          <tr>
            <th className="border-b border-gray-700 px-4 py-2 text-left">Status Code</th>
            <th className="border-b border-gray-700 px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody className="text-gray-300">
          <tr>
            <td className="border-b border-gray-700 px-4 py-2">400</td>
            <td className="border-b border-gray-700 px-4 py-2">Bad Request - Missing or invalid parameters</td>
          </tr>
          <tr>
            <td className="border-b border-gray-700 px-4 py-2">403</td>
            <td className="border-b border-gray-700 px-4 py-2">Forbidden - API limit exceeded or invalid secretKey</td>
          </tr>
          <tr>
            <td className="border-b border-gray-700 px-4 py-2">500</td>
            <td className="border-b border-gray-700 px-4 py-2">Internal Server Error</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Footer/>
  </div>
);

export default ApiDocs;
