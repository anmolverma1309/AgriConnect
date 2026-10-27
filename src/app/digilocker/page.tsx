'use client';

import { useState, useEffect, useRef } from 'react';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  size: string;
}

export default function DigilockerPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('documents') || '[]');
    setDocuments(saved);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    
    setTimeout(() => {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type || 'application/pdf',
        uploadedAt: new Date().toLocaleDateString(),
        size: (file.size / 1024).toFixed(1) + ' KB'
      };
      const updated = [...documents, newDoc];
      setDocuments(updated);
      localStorage.setItem('documents', JSON.stringify(updated));
      setUploading(false);
    }, 1000);
  };

  const deleteDoc = (id: string) => {
    const updated = documents.filter(d => d.id !== id);
    setDocuments(updated);
    localStorage.setItem('documents', JSON.stringify(updated));
  };

  const getIcon = (type: string) => {
    if (type.includes('pdf')) return '🔴';
    if (type.includes('image')) return '🖼️';
    return '📄';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Digital Locker</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Documents</h2>
            <span className="text-sm text-gray-500">{documents.length} files</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {documents.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No documents uploaded yet</p>
            ) : (
              documents.map(doc => (
                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getIcon(doc.type)}</span>
                    <div>
                      <p className="font-medium truncate max-w-[200px]">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.size} • {doc.uploadedAt}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteDoc(doc.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            onChange={handleUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-4 w-full border-2 border-dashed border-gray-300 text-gray-500 py-4 rounded-lg hover:border-green-500 hover:text-green-600 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : '+ Upload Document'}
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">AI Document Summary</h2>
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="font-medium text-green-800 mb-2">Storage Stats</h3>
            <p className="text-sm text-gray-700">Total Documents: {documents.length}</p>
            <p className="text-sm text-gray-700">Storage Used: ~{documents.reduce((sum, d) => sum + parseFloat(d.size), 0).toFixed(1)} KB</p>
            <p className="text-sm text-gray-700">Available: 50 MB</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Quick Tips</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep land records updated</li>
              <li>• Store insurance documents safely</li>
              <li>• Upload bank passbook for loan applications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
