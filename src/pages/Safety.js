import React, { useState } from 'react';
import DangerZoneMap from '../components/map/DangerZoneMap';

function Safety() {
  const [sosActive, setSosActive] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [selectedDangerZone, setSelectedDangerZone] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([
    { id: 1, name: 'John Doe', relation: 'Family', phone: '+91 98765 43210' },
    { id: 2, name: 'Jane Smith', relation: 'Friend', phone: '+91 87654 32109' }
  ]);
  const [newContact, setNewContact] = useState({ name: '', relation: '', phone: '' });
  
  // Sample danger zones data
  const dangerZones = [
    { 
      id: 1, 
      name: 'Downtown Construction Site', 
      level: 'moderate', 
      distance: '1.2 km', 
      description: 'Heavy machinery and construction work in progress.',
      detailedInfo: 'This area has ongoing construction of a new commercial complex. Heavy machinery is in operation throughout the day. The site has inadequate barriers and signage, creating potential hazards for pedestrians and vehicles passing by.',
      safetyTips: [
        'Avoid walking near the construction barriers',
        'Be cautious of construction vehicles entering and exiting the site',
        'Use alternative routes especially during peak construction hours (9 AM - 5 PM)'
      ],
      reportedIncidents: 2,
      lastUpdated: '2 hours ago'
    },
    { 
      id: 2, 
      name: 'Riverside Area', 
      level: 'high', 
      distance: '3.5 km', 
      description: 'Flooding reported due to heavy rainfall.',
      detailedInfo: 'Recent heavy rainfall has caused the river to overflow in certain sections. Water levels have risen significantly, and some low-lying paths are submerged. Local authorities have issued warnings to avoid the area until water levels recede.',
      safetyTips: [
        'Avoid all riverside paths and roads',
        'Do not attempt to cross flooded areas by foot or vehicle',
        'Follow evacuation instructions if you are in the affected neighborhoods',
        'Monitor local news for updates on water levels'
      ],
      reportedIncidents: 5,
      lastUpdated: '30 minutes ago'
    },
    { 
      id: 3, 
      name: 'Highway Junction', 
      level: 'moderate', 
      distance: '5.8 km', 
      description: 'Accident prone area with heavy traffic.',
      detailedInfo: 'This junction connects three major highways and experiences heavy traffic throughout the day. Poor visibility during certain hours and complex lane merging has led to multiple accidents in the past month. Traffic police have been deployed but caution is advised.',
      safetyTips: [
        'Reduce speed when approaching the junction',
        'Use navigation apps to find alternative routes during peak hours',
        'Be particularly cautious during early morning and evening when visibility is reduced',
        'Follow all traffic signals and police instructions'
      ],
      reportedIncidents: 3,
      lastUpdated: '1 day ago'
    }
  ];

  const handleSosToggle = () => {
    setSosActive(!sosActive);
    if (!sosActive) {
      // In a real app, this would trigger emergency protocols
      alert('SOS activated! Emergency contacts would be notified in a real application.');
    }
  };

  const handleLocationSharingToggle = () => {
    setLocationSharing(!locationSharing);
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setNewContact({
      ...newContact,
      [name]: value
    });
  };

  const addEmergencyContact = (e) => {
    e.preventDefault();
    if (newContact.name && newContact.phone) {
      setEmergencyContacts([
        ...emergencyContacts,
        { ...newContact, id: Date.now() }
      ]);
      setNewContact({ name: '', relation: '', phone: '' });
    }
  };

  const removeEmergencyContact = (id) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };

  const showDangerZoneDetails = (zone) => {
    setSelectedDangerZone(zone);
  };

  const closeDangerZoneDetails = () => {
    setSelectedDangerZone(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Safety & Emergency</h1>
      
      {/* SOS Button Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Emergency SOS</h2>
          <div className="flex flex-col items-center">
            <button
              onClick={handleSosToggle}
              className={`w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-xl focus:outline-none transition-colors duration-300 ${sosActive ? 'bg-red-600 animate-pulse' : 'bg-red-500 hover:bg-red-600'}`}
            >
              {sosActive ? 'ACTIVE' : 'SOS'}
            </button>
            <p className="mt-4 text-gray-600 text-center max-w-md">
              {sosActive 
                ? 'SOS is active. Your emergency contacts have been notified with your current location.'
                : 'Press the SOS button in case of emergency. This will alert your emergency contacts with your current location.'}
            </p>
          </div>
          
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Live Location Sharing</h3>
              <div className="relative inline-block w-12 mr-2 align-middle select-none">
                <input 
                  type="checkbox" 
                  name="toggle" 
                  id="locationToggle" 
                  checked={locationSharing}
                  onChange={handleLocationSharingToggle}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out"
                />
                <label 
                  htmlFor="locationToggle" 
                  className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${locationSharing ? 'bg-green-500' : 'bg-gray-300'}`}
                ></label>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">
              {locationSharing 
                ? 'Your trusted contacts can see your live location.'
                : 'Enable to share your live location with trusted contacts.'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Danger Zone Alerts Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-100">
          <h2 className="text-xl font-semibold text-gray-900">Danger Zone Alerts</h2>
          <p className="text-sm text-gray-600">Based on your current location and route</p>
        </div>
        
        <div className="p-6">
          {/* Map with danger zone visualization */}
          <div className="mb-6">
            <DangerZoneMap dangerZones={dangerZones} />
            <p className="mt-2 text-sm text-gray-500 text-center">
              Circles show danger zones with decreasing intensity as they expand outward
            </p>
          </div>
          
          {/* List of danger zones */}
          <div className="mt-8 divide-y divide-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nearby Danger Zones</h3>
            {dangerZones.map(zone => (
              <div key={zone.id} className="py-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${zone.level === 'high' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{zone.name}</h4>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${zone.level === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'} capitalize`}>
                        {zone.level} risk
                      </span>
                      <span className="ml-2 text-sm text-gray-500">{zone.distance} away</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{zone.description}</p>
                    <div className="mt-3 flex">
                      <button 
                        onClick={() => showDangerZoneDetails(zone)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        View Details
                      </button>
                      <button className="ml-3 inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Avoid Area
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Emergency Contacts Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <h2 className="text-xl font-semibold text-gray-900">Emergency Contacts</h2>
          <p className="text-sm text-gray-600">Manage your trusted emergency contacts</p>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Contact</h3>
            <form onSubmit={addEmergencyContact} className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 gap-x-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={newContact.name}
                    onChange={handleContactChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="relation" className="block text-sm font-medium text-gray-700">
                  Relation
                </label>
                <div className="mt-1">
                  <select
                    id="relation"
                    name="relation"
                    value={newContact.relation}
                    onChange={handleContactChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Select relation</option>
                    <option value="Family">Family</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="sm:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={newContact.phone}
                    onChange={handleContactChange}
                    className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="sm:col-span-6 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Your Emergency Contacts</h3>
            {emergencyContacts.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {emergencyContacts.map(contact => (
                  <li key={contact.id} className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-base font-medium text-gray-900">{contact.name}</h4>
                      <div className="mt-1 flex items-center">
                        <span className="text-sm text-gray-500">{contact.relation}</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-sm text-gray-500">{contact.phone}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => alert(`Calling ${contact.name}...`)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => removeEmergencyContact(contact.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">No emergency contacts added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Danger Zone Details Modal */}
      {selectedDangerZone && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={closeDangerZoneDetails}>
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3">
              <h3 className="text-lg font-semibold text-gray-900">Danger Zone Details</h3>
              <button
                onClick={closeDangerZoneDetails}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{selectedDangerZone.name}</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    selectedDangerZone.level === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  } capitalize`}>
                    {selectedDangerZone.level} risk
                  </span>
                  <span className="text-sm text-gray-500">{selectedDangerZone.distance} away</span>
                </div>
                <p className="text-gray-700">{selectedDangerZone.detailedInfo}</p>
              </div>
              
              <div>
                <h5 className="text-md font-semibold text-gray-900 mb-2">Safety Tips:</h5>
                <ul className="list-disc list-inside space-y-1">
                  {selectedDangerZone.safetyTips.map((tip, index) => (
                    <li key={index} className="text-sm text-gray-700">{tip}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Reported Incidents:</span>
                  <span className="ml-2 text-gray-700">{selectedDangerZone.reportedIncidents}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Last Updated:</span>
                  <span className="ml-2 text-gray-700">{selectedDangerZone.lastUpdated}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 mt-4 border-t">
              <button
                onClick={closeDangerZoneDetails}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Avoid This Area
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for toggle switch */}
      <style>{`
        .toggle-checkbox:checked {
          transform: translateX(100%);
          border-color: #fff;
        }
        .toggle-label {
          transition: background-color 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default Safety;