'use client';

import { useState, useRef } from 'react';

interface DiagnosisResult {
  success: boolean;
  diagnosis: {
    name: string;
    scientificName: string;
    symptoms: string[];
    treatment: string[];
    prevention: string[];
    severity: string;
    confidence: number;
  };
  alternatives: Array<{ name: string; probability: string }>;
  recommendation: string;
  nearbyExperts: Array<{ name: string; phone: string; distance: string }>;
  note: string;
}

export default function DiagnosePage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDiagnose = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    
    const formData = new FormData();
    formData.append('image', selectedImage);
    
    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        alert('Failed to analyze image: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to analyze image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedImage(null);
    setPreview(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Crop Diagnosis</h1>
      <p className="text-gray-600 mb-8">Upload a photo of your affected plant and our AI will identify the disease and suggest treatment options.</p>
      
      <div className="bg-white rounded-lg shadow-md p-8">
        {!result ? (
          <>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 mb-6 text-center">
              {preview ? (
                <div className="mb-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <button onClick={reset} className="mt-2 text-red-500 hover:text-red-700">Remove image</button>
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
                    onChange={handleFileSelect}
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
                  onClick={handleDiagnose}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </span>
                  ) : 'Diagnose Now'}
                </button>
              </div>
            )}
            
            <p className="text-sm text-gray-500 text-center mt-4">Supported formats: JPG, PNG (Max 10MB)</p>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              {preview && <img src={preview} alt="Analyzed" className="w-32 h-32 object-cover rounded-lg" />}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-red-600">{result.diagnosis.name}</h2>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                    {(result.diagnosis.confidence * 100).toFixed(0)}% confidence
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${result.diagnosis.severity === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {result.diagnosis.severity} Severity
                  </span>
                </div>
                <p className="text-gray-600">{result.recommendation}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 mb-2">Symptoms</h3>
                <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                  {result.diagnosis.symptoms.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Treatment</h3>
                <ul className="list-disc list-inside text-sm text-green-700 space-y-1">
                  {result.diagnosis.treatment.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">Prevention</h3>
                <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
                  {result.diagnosis.prevention.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Alternative possibilities:</strong> {result.alternatives.map(a => `${a.name} (${a.probability})`).join(', ')}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                <strong>Nearby experts:</strong> {result.nearbyExperts.map(e => `${e.name} (${e.distance}) - ${e.phone}`).join(', ')}
              </p>
              <p className="text-sm text-gray-500 mt-2 italic">{result.note}</p>
            </div>
            
            <button 
              onClick={reset}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
            >
              Diagnose Another Plant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
