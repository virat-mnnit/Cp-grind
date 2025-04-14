import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PersonalDetailsForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dob: '',
    location: '',
    bio: ''
  });
  const [codingPlatforms, setCodingPlatforms] = useState([{ platform: '', username: '' }]);
  const [academics, setAcademics] = useState({
    degree: '',
    institution: '',
    year: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const formatDateForInput = (isoDate) => {
    const date = new Date(isoDate);
    return date.toISOString().split('T')[0]; // Extract "yyyy-MM-dd"
  };
  
  
  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
  
        // Fetch user data
        const response = await axios.get('http://localhost:3001/api/v1/user/', {
          withCredentials: true,
        });
  
        if (response.status === 200) {
          const userData = response.data;
          
          // Store userId for platform updates
          if (userData._id) {
            setUserId(userData._id);
          }
  
          // Update state with fetched data
          setFormData({
            firstName: userData.firstname || '',
            lastName: userData.lastname || '',
            phone: userData.phone || '',
            dob: userData.dob ? formatDateForInput(userData.dob) : '',
            location: userData.location || '',
            bio: userData.bio || '',
          });
          if(userData.academics){
            const academicsData = JSON.parse(userData.academics);
            setAcademics(academicsData);
          }
          // Set profile image if available
          if (userData.profilePicture) {
            setProfileImageUrl(userData.profilePicture);
          }
  
          if (userData._id) {
            // Fetch platforms
            try {
              const platformResponse = await axios.get(
                `http://localhost:3001/api/v1/platforms/${userData._id}`,
                { withCredentials: true }
              );
  
              if (platformResponse.status === 200 && platformResponse.data) {
                const platforms = platformResponse.data.map((platform) => ({
                  platform: platform.platformName,
                  username: platform.platformUsername,
                }));
  
                setCodingPlatforms(platforms.length > 0 ? platforms : [{ platform: '', username: '' }]);
              }
            } catch (platformError) {
              console.error('Error fetching platforms:', platformError);
              // Keep default platform state if fetch fails
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle unauthorized access
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserData();
  }, [navigate]);
  
  // Handle basic form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Coding platforms functions
  const addCodingPlatform = () => {
    setCodingPlatforms([...codingPlatforms, { platform: '', username: '' }]);
  };

  const updateCodingPlatform = (index, field, value) => {
    const updatedPlatforms = [...codingPlatforms];
    updatedPlatforms[index][field] = value;
    setCodingPlatforms(updatedPlatforms);
  };

  const removeCodingPlatform = (index) => {
    setCodingPlatforms(platforms => platforms.filter((_, i) => i !== index));
  };

  // Academic details functions - updated for single object
  const handleAcademicChange = (field, value) => {
    setAcademics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Profile image functions
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const removeImage = () => {
    setProfileImage(null);
    setProfileImageUrl('');
    fileInputRef.current.value = '';
  };

  const handleBack = () => {
    navigate('/profile');
  };

  const syncCodingPlatforms = async () => {
    try {
      // Fetch the user data
      const userData = await axios.get('http://localhost:3001/api/v1/user/', {
        withCredentials: true, // Include cookies in the request
      });
  
      if (!userData || !userData.data) {
        console.log("Error in fetching user data");
        return;
      }
  
      // Fetch existing platforms from the database
      const { data: existingPlatforms } = await axios.get(`http://localhost:3001/api/v1/platforms/${userData.data._id}`, {
        withCredentials: true, // Include cookies in the request
      });
  
      let platformsToAdd = [];
      const platformsToDelete = [];
  
      // If there are no existing platforms, proceed to add new ones
      if (!existingPlatforms || existingPlatforms.length === 0) {
        console.log("No existing platforms found. Proceeding to add new platforms.");
        platformsToAdd = codingPlatforms;
      } else {
        // Identify platforms to add or update
        codingPlatforms.forEach((platformObj) => {
          const match = existingPlatforms.some(
            (existing) =>
              existing.platformName === platformObj.platform && existing.platformUsername === platformObj.username
          );
          if (!match) {
            platformsToAdd.push(platformObj);
          }
        });
  
        // Identify platforms to delete
        existingPlatforms.forEach((platformObj) => {
          const match = codingPlatforms.find((current) => current.platform === platformObj.platformName);
          if (!match) {
            platformsToDelete.push(platformObj._id); // Use `_id` for deletion
          }
        });
      }
  
      // Add platforms one at a time
      for (const { platform, username } of platformsToAdd) {
        try {
          await axios.post('http://localhost:3001/api/v1/platforms/add', {
            platformName: platform,
            platformUsername: username,
          }, {
            withCredentials: true, // Include cookies in the request
          });
          console.log(`Platform added: ${platform}`);
        } catch (error) {
          console.error(`Error adding platform: ${platform}`, error);
        }
      }
  
      // Delete platforms one at a time
      for (const id of platformsToDelete) {
        try {
          await axios.delete(`http://localhost:3001/api/v1/platforms/remove/${id}`, {
            withCredentials: true, // Include cookies in the request
          });
          console.log(`Platform removed: ${id}`);
        } catch (error) {
          console.error(`Error removing platform with id: ${id}`, error);
        }
      }
      console.log(platformsToAdd);
      console.log(platformsToDelete);
      console.log(existingPlatforms);
      console.log(codingPlatforms);
      console.log('Platforms synced successfully!');
    } catch (error) {
      console.error('Error syncing platforms:', error);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Create FormData object for multipart/form-data submission
        const formDataToSubmit = new FormData();
        
        // Add basic profile fields
        formDataToSubmit.append('firstname', formData.firstName);
        formDataToSubmit.append('lastname', formData.lastName);
        formDataToSubmit.append('phone', formData.phone);
        formDataToSubmit.append('dob', formData.dob);
        formDataToSubmit.append('location', formData.location);
        formDataToSubmit.append('bio', formData.bio);
        
        // Add academics as a JSON string (now a single object)
        formDataToSubmit.append('academics', JSON.stringify(academics));

        // Add profile image if exists
        if (profileImage) {
            formDataToSubmit.append('profilePicture', profileImage);
        }
        
        // Log the FormData values for debugging
        console.log(formDataToSubmit);
        for (let pair of formDataToSubmit.entries()) {
          console.log(pair[0] + ': ' + pair[1]);
        }

        // Update the user profile
        const userResponse = await axios.put(
            'http://localhost:3001/api/v1/user/update',
            formDataToSubmit,
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );
        // update coding platforms
        await syncCodingPlatforms();
        alert("Profile updated successfully");
        // navigate("/profile");

    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
    }
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-lg font-medium text-gray-700">Loading your profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 relative">
            <button
              type="button"
              onClick={handleBack}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200 focus:outline-none"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-white text-center">Personal Details</h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-8" encType="multipart/form-data">
            {/* Profile Image */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Profile Image</h2>
              
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  {profileImageUrl ? (
                    <div className="relative">
                      <img 
                        src={profileImageUrl} 
                        alt="Profile preview" 
                        className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 focus:outline-none"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col">
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    name="profilePicture"
                  />
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Upload Image
                  </button>
                  <p className="mt-1 text-sm text-gray-500">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Basic Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      name="dob"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>
              </div>

            
            {/* Academic Details - Now as a single object */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Academic Details</h2>
              
              <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="degree" className="block text-sm font-medium text-gray-700">Degree/Course</label>
                    <input
                      type="text"
                      id="degree"
                      value={academics.degree}
                      onChange={(e) => handleAcademicChange('degree', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="institution" className="block text-sm font-medium text-gray-700">Institution</label>
                    <input
                      type="text"
                      id="institution"
                      value={academics.institution}
                      onChange={(e) => handleAcademicChange('institution', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="year" className="block text-sm font-medium text-gray-700">Year</label>
                    <input
                      type="text"
                      id="year"
                      value={academics.year}
                      onChange={(e) => handleAcademicChange('year', e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coding Platforms */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Coding Platforms</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {codingPlatforms.map((platform, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`platform-${index}`} className="block text-sm font-medium text-gray-700">Platform Name</label>
                        <input
                          type="text"
                          id={`platform-${index}`}
                          value={platform.platform}
                          onChange={(e) => updateCodingPlatform(index, 'platform', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                          placeholder="GitHub, LeetCode, etc."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor={`username-${index}`} className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                          type="text"
                          id={`username-${index}`}
                          value={platform.username}
                          onChange={(e) => updateCodingPlatform(index, 'username', e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    
                    {codingPlatforms.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCodingPlatform(index)}
                        className="mt-3 text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
              
              <button
                type="button"
                onClick={addCodingPlatform}
                className="text-sm flex items-center text-blue-600 hover:text-blue-800"
              >
                <span className="mr-1">+</span> Add more platforms
              </button>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-end pt-4 border-t">
              <button
                type="submit"
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetailsForm;