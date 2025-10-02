import React, { useState } from 'react';

function TripForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    tripNumber: '',
    origin: '',
    originTime: '',
    destination: '',
    destinationTime: '',
    mode: 'car',
    purpose: '',
    accompaniedBy: [],
    notes: ''
  });

  const [accompaniedPerson, setAccompaniedPerson] = useState({
    name: '',
    age: '',
    relation: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAccompaniedChange = (e) => {
    const { name, value } = e.target;
    setAccompaniedPerson({
      ...accompaniedPerson,
      [name]: value
    });
  };

  const addAccompaniedPerson = () => {
    if (accompaniedPerson.name && accompaniedPerson.relation) {
      setFormData({
        ...formData,
        accompaniedBy: [...formData.accompaniedBy, { ...accompaniedPerson, id: Date.now() }]
      });
      setAccompaniedPerson({ name: '', age: '', relation: '' });
    }
  };

  const removeAccompaniedPerson = (id) => {
    setFormData({
      ...formData,
      accompaniedBy: formData.accompaniedBy.filter(person => person.id !== id)
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Trip Information</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">Enter details about your trip</p>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="tripNumber" className="block text-sm font-medium text-gray-700">
                Trip Number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="tripNumber"
                  id="tripNumber"
                  value={formData.tripNumber}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="e.g. TRIP-001"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                Trip Purpose
              </label>
              <div className="mt-1">
                <select
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="">Select purpose</option>
                  <option value="work">Work/Business</option>
                  <option value="education">Education</option>
                  <option value="shopping">Shopping</option>
                  <option value="leisure">Leisure/Entertainment</option>
                  <option value="medical">Medical</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="origin" className="block text-sm font-medium text-gray-700">
                Origin
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="origin"
                  id="origin"
                  value={formData.origin}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Starting location"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="originTime" className="block text-sm font-medium text-gray-700">
                Departure Time
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  name="originTime"
                  id="originTime"
                  value={formData.originTime}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-700">
                Destination
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="destination"
                  id="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="End location"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="destinationTime" className="block text-sm font-medium text-gray-700">
                Arrival Time
              </label>
              <div className="mt-1">
                <input
                  type="datetime-local"
                  name="destinationTime"
                  id="destinationTime"
                  value={formData.destinationTime}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="mode" className="block text-sm font-medium text-gray-700">
                Mode of Transport
              </label>
              <div className="mt-1 flex flex-wrap gap-4">
                {['car', 'bus', 'train', 'bike', 'walk', 'other'].map((mode) => (
                  <div key={mode} className="flex items-center">
                    <input
                      id={`mode-${mode}`}
                      name="mode"
                      type="radio"
                      value={mode}
                      checked={formData.mode === mode}
                      onChange={handleChange}
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                    />
                    <label htmlFor={`mode-${mode}`} className="ml-2 block text-sm text-gray-700 capitalize">
                      {mode}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Additional Notes
              </label>
              <div className="mt-1">
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Any additional information about your trip"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <h4 className="text-md font-medium text-gray-900 mb-2">Accompanied By</h4>
              <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={accompaniedPerson.name}
                      onChange={handleAccompaniedChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                    Age
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="age"
                      id="age"
                      value={accompaniedPerson.age}
                      onChange={handleAccompaniedChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
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
                      value={accompaniedPerson.relation}
                      onChange={handleAccompaniedChange}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select relation</option>
                      <option value="family">Family</option>
                      <option value="friend">Friend</option>
                      <option value="colleague">Colleague</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={addAccompaniedPerson}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              {formData.accompaniedBy.length > 0 && (
                <div className="mt-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">People accompanying you:</h5>
                  <ul className="divide-y divide-gray-200">
                    {formData.accompaniedBy.map((person) => (
                      <li key={person.id} className="py-2 flex justify-between items-center">
                        <div>
                          <span className="text-sm font-medium text-gray-900">{person.name}</span>
                          <span className="text-sm text-gray-500 ml-2">({person.relation})</span>
                          {person.age && <span className="text-sm text-gray-500 ml-2">{person.age} years</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAccompaniedPerson(person.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Save Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TripForm;