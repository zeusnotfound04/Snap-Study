import React, { useState } from 'react';
import Tesseract from 'tesseract.js';
import axios from 'axios';

function App() {
  const [image, setImage] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const extractTextFromImage = () => {
    if (!image) return;
    setLoading(true);

    Tesseract.recognize(image, 'eng', { logger: (m) => console.log(m) })
      .then(({ data: { text } }) => {
        setExtractedText(text);
        sendTextToBackend(text);
      })
      .catch((err) => {
        console.error('Error extracting text:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sendTextToBackend = async (text) => {
    try {
      const response = await axios.post('http://localhost:3001/process-text', { text });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error sending text to backend:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 space-y-6 relative z-10 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600">
      
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32 mb-4"></div>
          <h2 className="text-white text-2xl font-semibold">Extracting Text...</h2>
          <p className="text-white">Please wait a moment.</p>
        </div>
      )}

    
      <div className="absolute top-0 w-full h-full bg-gradient-to-b from-black via-transparent to-black opacity-60 z-0"></div>

      <h1 className="heading text-6xl font-bold text-white relative z-20 drop-shadow-lg shadow-black tracking-wider">
        Snap Study
      </h1>
      

      <p className="tagline text-2xl font-light italic text-white relative z-20 max-w-lg text-center leading-relaxed tracking-wide shadow-lg shadow-gray-700">
        "Turn your pictures into knowledge in a snap! Learn smarter, not harder."
      </p>

 
      <div className="upload-section w-full max-w-lg space-y-4 relative z-20">
        <h3 className="text-center text-white font-semibold text-lg tracking-widest">
          Snap it, and Start Studying Smarter
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-500 file:text-white hover:file:bg-teal-600"
        />
        {image && (
          <div className="uploaded-image mt-4">
            <img
              src={image}
              alt="Uploaded"
              className="rounded-lg shadow-lg w-full object-cover"
            />
          </div>
        )}
      </div>

  
      <div className="actions space-y-4 relative z-20">
        <button
          onClick={extractTextFromImage}
          disabled={loading || !image}
          className={`px-6 py-2 rounded-lg bg-teal-500 hover:bg-teal-600 focus:outline-none transition-transform duration-300 ease-in-out ${
            loading || !image
              ? 'opacity-50 cursor-not-allowed'
              : 'transform hover:scale-105'
          }`}
        >
          {loading ? 'Extracting Text...' : 'Extract Text'}
        </button>
      </div>

      {extractedText && (
        <div className="extracted-text bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg space-y-2 relative z-20">
          <h3 className="text-2xl font-semibold text-teal-400 underline underline-offset-4">
            Extracted Text:
          </h3>
          <p className="text-base text-gray-200 leading-relaxed tracking-wide">
            {extractedText}
          </p>
        </div>
      )}


      {summary && (
        <div className="summary-section bg-gray-900 p-6 rounded-lg shadow-xl w-full max-w-lg space-y-2 relative z-20">
          <h3 className="text-2xl font-semibold text-teal-400 underline underline-offset-4">
            Summary:
          </h3>
          <p className="text-base text-gray-200 leading-relaxed tracking-wide">
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
