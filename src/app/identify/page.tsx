'use client';

import { useState, useRef } from 'react';

const PLANTS = [
  { name: "Wheat", type: "Crop", description: "Triticum aestivum - Major cereal grain" },
  { name: "Rice", type: "Crop", description: "Oryza sativa - Staple food for half the world" },
  { name: "Tomato", type: "Vegetable", description: "Solanum lycopersicum - Rich in vitamins" },
  { name: "Cotton", type: "Crop", description: "Gossypium - Natural fiber crop" },
  { name: "Parthenium", type: "Weed", description: "Parthenium hysterophorus - Invasive weed" },
  { name: "Chickpea", type: "Pulse", description: "Cicer arietinum - High protein legume" },
];

export default function IdentifyPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<typeof PLANTS[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const identify = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(PLANTS[Math.floor(Math.random() * PLANTS.length)]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Plant Identifier</h1>
      <p className="text-gray-600 mb-8">Take a photo or upload an image to identify crops, weeds, and plants</p>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        {!result ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6 text-center">
              {selectedImage ? (
                <div className="mb-4">
                  <img src={selectedImage} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <button 
                    onClick={() => { setSelectedImage(null); setResult(null); }}
                    className="mt-2 text-red-500 hover:text-red-700"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <>
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-600 mb-4">Drag and drop or click to upload</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleFile}
                    className="hidden"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
                  >
                    Select Image
                  </button>
                </>
              )}
            </div>
            
            {selectedImage && (
              <div className="text-center">
                <button 
                  onClick={identify}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Identify Plant'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            {selectedImage && <img src={selectedImage} alt="Identified" className="w-32 h-32 object-cover rounded-lg mx-auto mb-4" />}
            <div className="bg-green-50 p-6 rounded-lg">
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">{result.type}</span>
              <h2 className="text-2xl font-bold text-green-800 mt-2">{result.name}</h2>
              <p className="text-gray-600 mt-2">{result.description}</p>
              <div className="mt-4 flex gap-2 justify-center">
                <button 
                  onClick={() => { setResult(null); setSelectedImage(null); }}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  Identify Another
                </button>
                <a 
                  href={`https://en.wikipedia.org/wiki/${result.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
