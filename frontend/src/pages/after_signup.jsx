import React, { useState } from 'react';
import { User, Book, Code, Plus, Trash2 } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
export default function SignupCompletion() {
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    dateOfBirth: '',
    phoneNumber: '',
    bio: ''
  });

  const [academicDetails, setAcademicDetails] = useState({
    institution: '',
    degree: '',
    fieldOfStudy: '',
    graduationYear: '',
    cgpa: ''
  });

  const [platforms, setPlatforms] = useState([
    { name: '', username: '' },
    { name: '', username: '' },
    { name: '', username: '' },
    { name: '', username: '' },
    { name: '', username: '' }
  ]);

  const platformOptions = [
    'GitHub',
    'LeetCode',
    'CodeChef',
    'HackerRank',
    'Codeforces',
    'TopCoder',
    'AtCoder',
    'CodePen',
    'StackOverflow',
    'Kaggle'
  ];
  const navigate =useNavigate();
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    setPersonalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAcademicChange = (e) => {
    const { name, value } = e.target;
    setAcademicDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlatformChange = (index, field, value) => {
    const updatedPlatforms = [...platforms];
    updatedPlatforms[index] = {
      ...updatedPlatforms[index],
      [field]: value
    };
    setPlatforms(updatedPlatforms);
  };

  const addPlatform = () => {
    setPlatforms([...platforms, { name: '', username: '' }]);
  };

  const removePlatform = (index) => {
    const updatedPlatforms = platforms.filter((_, i) => i !== index);
    setPlatforms(updatedPlatforms);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   navigate('/profile');
    // Here you would submit the data to your backend
    alert('Profile information submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          <p className="mt-2">Please provide additional information to personalize your experience</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Personal Details Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <User size={20} className="mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-700">Personal Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={personalDetails.fullName}
                  onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  name="dateOfBirth"
                  value={personalDetails.dateOfBirth}
                  onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  name="phoneNumber"
                  value={personalDetails.phoneNumber}
                  onChange={handlePersonalChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-1">Bio</label>
                <textarea 
                  name="bio"
                  value={personalDetails.bio}
                  onChange={handlePersonalChange}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                ></textarea>
              </div>
            </div>
          </div>

          {/* Academic Details Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Book size={20} className="mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-700">Academic Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Institution</label>
                <input 
                  type="text" 
                  name="institution"
                  value={academicDetails.institution}
                  onChange={handleAcademicChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Degree</label>
                <input 
                  type="text" 
                  name="degree"
                  value={academicDetails.degree}
                  onChange={handleAcademicChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Field of Study</label>
                <input 
                  type="text" 
                  name="fieldOfStudy"
                  value={academicDetails.fieldOfStudy}
                  onChange={handleAcademicChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Graduation Year</label>
                <input 
                  type="number" 
                  name="graduationYear"
                  value={academicDetails.graduationYear}
                  onChange={handleAcademicChange}
                  min="1950"
                  max="2030"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">CGPA</label>
                <input 
                  type="number" 
                  name="cgpa"
                  value={academicDetails.cgpa}
                  onChange={handleAcademicChange}
                  step="0.01"
                  min="0"
                  max="10.0"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Coding Platforms Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Code size={20} className="mr-2 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-700">Coding Platforms</h2>
            </div>
            
            {platforms.map((platform, index) => (
              <div key={index} className="flex flex-wrap mb-3 items-end">
                <div className="w-full md:w-2/5 pr-2 mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-1">Platform</label>
                  <select
                    value={platform.name}
                    onChange={(e) => handlePlatformChange(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Platform</option>
                    {platformOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full md:w-2/5 pr-2 mb-2 md:mb-0">
                  <label className="block text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    value={platform.username}
                    onChange={(e) => handlePlatformChange(index, 'username', e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your username"
                  />
                </div>
                <div className="w-full md:w-1/5 flex">
                  {index >= 5 && (
                    <button
                      type="button"
                      onClick={() => removePlatform(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 mr-2 flex items-center"
                    >
                      <Trash2 size={18} className="mr-1" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              type="button"
              onClick={addPlatform}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Plus size={18} className="mr-1" />
              Add Another Platform
            </button>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Complete Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
