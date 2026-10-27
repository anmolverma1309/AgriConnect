'use client';

import { useState, useEffect } from 'react';

interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  landArea: string;
  crops: string;
  aadhaar: string;
}

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>({
    name: 'Anmol Verma',
    email: 'aanmolverma1309@gmail.com',
    phone: '+91 9019989269',
    location: 'Bannikuppe, Karnataka',
    landArea: '4.5',
    crops: 'Wheat, Rice, Tomato',
    aadhaar: 'XXXX-XXXX-1234'
  });

  useEffect(() => {
    const saved = localStorage.getItem('profile');
    if (saved) setProfile(JSON.parse(saved));
  }, []);

  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    setEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Profile</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-3xl font-bold text-green-600">{profile.name.charAt(0)}</span>
          </div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-gray-500">Farmer</p>
          <p className="text-sm text-gray-400 mt-1">{profile.location}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Account Details</h2>
            {!editing && (
              <button 
                onClick={() => setEditing(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Edit
              </button>
            )}
          </div>
          
          {editing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-500">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Email</label>
                  <input 
                    type="email" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Location</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Land Area (acres)</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={profile.landArea}
                    onChange={(e) => setProfile({...profile, landArea: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-500">Main Crops</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2"
                    value={profile.crops}
                    onChange={(e) => setProfile({...profile, crops: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleSave}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                  Save Changes
                </button>
                <button 
                  onClick={() => setEditing(false)}
                  className="bg-gray-300 px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-gray-500 text-sm">Full Name</p><p className="font-medium">{profile.name}</p></div>
              <div><p className="text-gray-500 text-sm">Email</p><p className="font-medium">{profile.email}</p></div>
              <div><p className="text-gray-500 text-sm">Phone</p><p className="font-medium">{profile.phone}</p></div>
              <div><p className="text-gray-500 text-sm">Aadhaar</p><p className="font-medium">{profile.aadhaar}</p></div>
              <div><p className="text-gray-500 text-sm">Land Area</p><p className="font-medium">{profile.landArea} acres</p></div>
              <div><p className="text-gray-500 text-sm">Main Crops</p><p className="font-medium">{profile.crops}</p></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
