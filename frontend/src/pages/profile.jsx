import React, { useState } from 'react';
import { MessageCircle, UserPlus, Check, X, ExternalLink, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ 
  userData = null, 
  platformWeights = {}, 
  customRatingThresholds = null,
  showRecentActivity = true
}) => {
  // Default user data to use if none is provided
  const defaultUserData = {
    name: "Demo User",
    email: "demo.user@example.com",
    bio: "Passionate competitive programmer",
    avatar: "https://via.placeholder.com/150",
    country: "United States",
    institution: "Tech University",
    isFriend: false,
    platforms: [
      { 
        name: "CodeForces", 
        rating: 1750, 
        color: "#3B82F6", // Will be overridden by platformColors
        maxRating: 1850, 
        solved: 320,
        maxPossibleRating: 3500,
        contests: 15,
        profileUrl: "https://codeforces.com/",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/codeforces.svg"
      },
      { 
        name: "LeetCode", 
        rating: 2050, 
        color: "#3B82F6", // Will be overridden by platformColors
        maxRating: 2100, 
        solved: 450,
        maxPossibleRating: 3500,
        contests: 22,
        profileUrl: "https://leetcode.com/",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/leetcode.svg"
      },
      { 
        name: "CodeChef", 
        rating: 1932, 
        color: "#3B82F6", // Will be overridden by platformColors
        maxRating: 2010, 
        solved: 280,
        maxPossibleRating: 3500,
        contests: 14,
        profileUrl: "https://codechef.com/",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/codechef.svg"
      },
      { 
        name: "AtCoder", 
        rating: 1756, 
        color: "#3B82F6", // Will be overridden by platformColors
        maxRating: 1800, 
        solved: 210,
        maxPossibleRating: 4000,
        contests: 10,
        profileUrl: "https://atcoder.jp/",
        logo: "https://img.atcoder.jp/assets/favicon.png"
      },
      { 
        name: "GeeksForGeeks", 
        rating: 340, 
        color: "#3B82F6", // Will be overridden by platformColors
        maxRating: 350, 
        solved: 175,
        maxPossibleRating: 500,
        contests: 8,
        profileUrl: "https://geeksforgeeks.org/",
        logo: "https://cdn.jsdelivr.net/npm/simple-icons@v8/icons/geeksforgeeks.svg"
      }
    ],
    activities: [
      {
        title: "Solved 'Two Sum'",
        platform: "LeetCode",
        timeAgo: "2 days ago",
        description: "Implemented an O(n) solution using hash map",
        tag: "Easy"
      },
      {
        title: "Participated in Educational Round",
        platform: "CodeForces",
        timeAgo: "1 week ago",
        description: "Solved 4 out of 6 problems",
        tag: "Contest"
      },
      {
        title: "Solved 'Binary Search Tree'",
        platform: "GeeksForGeeks",
        timeAgo: "2 weeks ago",
        description: "Implemented insertion, deletion and search operations",
        tag: "Medium"
      }
    ]
  };

  // Define platform-specific colors for consistent branding - now using different colors
  const platformColors = {
    "CodeForces": "#E05D44", // Red for CodeForces
    "LeetCode": "#FFA116",   // Orange/Yellow for LeetCode
    "CodeChef": "#5CB85C",   // Green for CodeChef
    "AtCoder": "#9966CC",    // Purple for AtCoder
    "GeeksForGeeks": "#2F8D46" // Dark Green for GeeksForGeeks
  };

  // Use provided data or fall back to default data
  const data = userData || defaultUserData;

  // State for friend status
  const [isFriend, setIsFriend] = useState(data.isFriend || false);
  const [friendRequestSent, setFriendRequestSent] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  // Default weights if not provided through props
  const defaultWeights = {
    "CodeForces": 1.2,
    "LeetCode": 1.1,
    "CodeChef": 1.0,
    "AtCoder": 1.3,
    "GeeksForGeeks": 0.8
  };

  // Merge custom weights with defaults
  const weights = { ...defaultWeights, ...platformWeights };

  // Default rating thresholds
  const defaultRatingThresholds = [
    { threshold: 2400, label: "Grandmaster", color: "text-red-600" },
    { threshold: 2100, label: "Master", color: "text-orange-500" },
    { threshold: 1900, label: "Expert", color: "text-purple-600" },
    { threshold: 1600, label: "Specialist", color: "text-blue-500" },
    { threshold: 1400, label: "Pupil", color: "text-green-500" },
    { threshold: 0, label: "Newbie", color: "text-gray-500" }
  ];

  // Use custom thresholds if provided
  const ratingThresholds = customRatingThresholds || defaultRatingThresholds;

  // Calculate overall score based on platform ratings
  const calculateScore = () => {
    if (!data || !data.platforms || data.platforms.length === 0) {
      return 0;
    }

    let totalWeightedScore = 0;
    let totalWeight = 0;

    data.platforms.forEach(platform => {
      const weight = weights[platform.name] || 1;
      totalWeightedScore += platform.rating * weight;
      totalWeight += weight;
    });

    return Math.round(totalWeightedScore / totalWeight);
  };

  // Get total solved problems
  const getTotalSolved = () => {
    if (!data || !data.platforms) return 0;
    return data.platforms.reduce((total, platform) => total + platform.solved, 0);
  };

  // Define rating label based on score
  const getRatingInfo = (score) => {
    for (const { threshold, label, color } of ratingThresholds) {
      if (score >= threshold) {
        return { label, color };
      }
    }
    return { label: "Unrated", color: "text-gray-400" };
  };

  // Get platform rank description
  const getPlatformRank = (platform) => {
    // Platform-specific ranking logic
    if (platform.name === "CodeForces") {
      if (platform.rating >= 2400) return "International Grandmaster";
      if (platform.rating >= 2300) return "Grandmaster";
      if (platform.rating >= 2100) return "International Master";
      if (platform.rating >= 1900) return "Master";
      if (platform.rating >= 1600) return "Candidate Master";
      if (platform.rating >= 1400) return "Expert";
      if (platform.rating >= 1200) return "Specialist";
      if (platform.rating >= 1000) return "Pupil";
      return "Newbie";
    } else if (platform.name === "LeetCode") {
      if (platform.rating >= 2500) return "Guardian";
      if (platform.rating >= 2200) return "Knight";
      if (platform.rating >= 1800) return "Expert";
      if (platform.rating >= 1600) return "Advanced";
      return "Beginner";
    } else if (platform.name === "CodeChef") {
      if (platform.rating >= 2500) return "7★";
      if (platform.rating >= 2200) return "6★";
      if (platform.rating >= 2000) return "5★";
      if (platform.rating >= 1800) return "4★";
      if (platform.rating >= 1600) return "3★";
      if (platform.rating >= 1400) return "2★";
      return "1★";
    } else if (platform.name === "AtCoder") {
      if (platform.rating >= 2800) return "Red";
      if (platform.rating >= 2400) return "Orange";
      if (platform.rating >= 2000) return "Yellow";
      if (platform.rating >= 1600) return "Blue";
      if (platform.rating >= 1200) return "Cyan";
      if (platform.rating >= 800) return "Green";
      if (platform.rating >= 400) return "Brown";
      return "Gray";
    } else if (platform.name === "GeeksForGeeks") {
      if (platform.rating >= 400) return "Coding Ninja";
      if (platform.rating >= 300) return "Expert Coder";
      if (platform.rating >= 200) return "Skilled Programmer";
      if (platform.rating >= 100) return "Beginner Coder";
      return "Novice";
    }
    return "Rated";
  };

  // Calculate platform-specific percentile
  const getPercentile = (platform) => {
    // Simplified percentile calculations - these would ideally be based on real distribution data
    const maxRatings = {
      "CodeForces": 3800,
      "LeetCode": 3500,
      "CodeChef": 3800,
      "AtCoder": 4000,
      "GeeksForGeeks": 500
    };
    
    const maxForPlatform = maxRatings[platform.name] || 3000;
    return Math.min(Math.round((platform.rating / maxForPlatform) * 100), 100);
  };

  // Function to handle adding/removing friend
  const handleFriendAction = () => {
    if (isFriend) {
      setIsFriend(false);
    } else {
      setFriendRequestSent(true);
      // In a real app, we would call an API to send friend request
      // For demo purposes, we'll automatically accept after 1.5 seconds
      setTimeout(() => {
        setFriendRequestSent(false);
        setIsFriend(true);
      }, 1500);
    }
  };

  // Function to handle sending message
  const handleSendMessage = () => {
    // In a real app, we would send the message to an API
    // For demo purposes, we'll just clear the input and close the modal
    setMessage('');
    setShowMessageModal(false);
    // You could show a success toast or notification here
  };

  const score = calculateScore();
  const { label: ratingLabel, color: ratingColor } = getRatingInfo(score);

  // Get platform color (with fallback) - now uses the updated platform colors
  const getPlatformColor = (platform) => {
    return platformColors[platform.name] || "#3B82F6";
  };
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    // In a real app, you would use router navigation here
    console.log("Navigating to home...");
    navigate("/");
    // Example with react-router:
    // navigate('/');
  };


  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Stylish Home button at the top */}
        <div className="mb-4 flex justify-start">
          <button 
            onClick={handleNavigateHome}
            className="group relative overflow-hidden px-5 py-2.5 rounded-full bg-white shadow-md text-blue-600 font-medium transition-all hover:shadow-lg hover:bg-blue-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="flex items-center">
              <Home size={18} className="mr-2 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-300"></div>
          </button>
        </div>
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-6 md:mb-0">
              <img 
                src={data.avatar} 
                alt="Profile" 
                className="w-20 h-20 rounded-full border-4 border-white shadow-lg mr-6" 
              />
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold">{data.name}</h1>
                  {isFriend && (
                    <span className="ml-3 bg-green-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                      <Check size={12} className="mr-1" /> Friend
                    </span>
                  )}
                </div>
                <p className="text-blue-100">{data.email}</p>
                {data.bio && <p className="text-blue-100 mt-1 max-w-lg">{data.bio}</p>}
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
            <div className="flex flex-col space-y-3 mb-4 mt-0">
                <button 
                  onClick={() => setShowMessageModal(true)}
                  className="flex items-center justify-center px-4 py-2 bg-white text-blue-700 hover:bg-blue-50 rounded-full transition-colors text-sm font-medium"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message
                </button>
                
                <button 
                  onClick={handleFriendAction}
                  disabled={friendRequestSent}
                  className={`flex items-center px-4 py-2 rounded-full transition-colors text-sm font-medium w-36 ${
                    isFriend 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : friendRequestSent 
                        ? 'bg-gray-200 text-gray-500' 
                        : 'bg-white text-green-600 hover:bg-green-50'
                  }`}
                >
                  {isFriend ? (
                    <>
                      <X size={16} className="mr-2" />
                      Unfriend
                    </>
                  ) : friendRequestSent ? (
                    'Request Sent...'
                  ) : (
                    <>
                      <UserPlus size={16} className="mr-2" />
                      Add Friend
                    </>
                  )}
                </button>
              </div>
              
              <div className="text-center md:text-right">
                <div className="text-lg">Overall Score</div>
                <div className="text-4xl font-bold">{score}</div>
                <div className={`text-sm font-semibold ${ratingColor}`}>{ratingLabel}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Total Problems: {getTotalSolved()}
            </span>
            <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
              Active Platforms: {data.platforms?.length || 0}
            </span>
            {data.country && (
              <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {data.country}
              </span>
            )}
            {data.institution && (
              <span className="bg-white/20 text-white text-sm font-semibold px-3 py-1 rounded-full">
                {data.institution}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Platform Cards - Enhanced Version */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Coding Platforms</h2>
        
        {(!data.platforms || data.platforms.length === 0) ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center text-gray-500">No platform data available</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.platforms.map((platform, index) => {
              const platformColor = getPlatformColor(platform);
              const percentile = getPercentile(platform);
              const ratingPercentage = Math.min((platform.rating / (platform.maxPossibleRating || 3000)) * 100, 100);
              
              return (
                <div key={index} className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1" 
                     style={{ borderTop: `4px solid ${platformColor}` }}>
                  <div className="p-6 relative">
                    {/* Platform header with subtle hover effect */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        {platform.logo ? (
                          <div className="w-10 h-10 mr-3 rounded-full bg-gray-50 p-2 flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                            <img 
                              src={platform.logo} 
                              alt={`${platform.name} logo`} 
                              className="w-6 h-6" 
                              style={{ filter: "invert(0.5)" }}
                            />
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: platformColor }}></div>
                        )}
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{platform.name}</h3>
                      </div>
                      <span className="bg-gray-100 group-hover:bg-blue-50 px-3 py-1 rounded-full text-sm font-medium transition-colors">
                        {getPlatformRank(platform)}
                      </span>
                    </div>
                    
                    {/* Rating section with gradient background */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="relative overflow-hidden p-4 rounded-lg text-center bg-gradient-to-br from-white to-gray-50 shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: platformColor }}></div>
                        <div className="text-sm text-gray-500">Current Rating</div>
                        <div className="text-2xl font-bold" style={{ color: platformColor }}>{platform.rating}</div>
                      </div>
                      <div className="relative overflow-hidden p-4 rounded-lg text-center bg-gradient-to-br from-white to-gray-50 shadow-sm">
                        <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: platformColor }}></div>
                        <div className="text-sm text-gray-500">Max Rating</div>
                        <div className="text-2xl font-bold" style={{ color: platformColor }}>{platform.maxRating}</div>
                      </div>
                    </div>
                    
                    {/* Rating progress with animated bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-500">Rating Progress</span>
                        <span className="text-sm font-medium px-2 py-0.5 rounded-full" 
                              style={{ backgroundColor: `${platformColor}20`, color: platformColor }}>
                          Top {percentile}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-1000 ease-out group-hover:brightness-110" 
                          style={{ 
                            width: `${ratingPercentage}%`,
                            backgroundColor: platformColor,
                            boxShadow: `0 0 5px ${platformColor}80`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* Stats section with icons */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                             style={{ backgroundColor: `${platformColor}20` }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={platformColor}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Problems Solved</div>
                          <div className="text-lg font-bold">{platform.solved}</div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 rounded-lg bg-gray-50 group-hover:bg-gray-100 transition-colors">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3" 
                             style={{ backgroundColor: `${platformColor}20` }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill={platformColor}>
                            <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                            <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Contests</div>
                          <div className="text-lg font-bold">{platform.contests || Math.round(platform.solved / 20)}</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Profile link with better button styling */}
                    {platform.profileUrl && (
                      <a 
                        href={platform.profileUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full mt-4 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800 rounded-lg transition-all duration-300 text-sm font-medium border border-gray-200 group-hover:border-gray-300"
                        style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}
                      >
                        View Profile 
                        <ExternalLink size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Recent Activity section - only shown if enabled via props */}
        {showRecentActivity && data.activities && data.activities.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Activity</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Latest Updates</h3>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                  {data.activities.length} Activities
                </span>
              </div>
              <ul className="divide-y divide-gray-200">
                {data.activities.map((activity, index) => {
                  // Use the platform-specific color for activities
                  const activityColor = platformColors[activity.platform] || "#3B82F6";
                  
                  return (
                    <li key={index} className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm" style={{ color: activityColor }}>
                            {activity.platform} • {activity.timeAgo}
                          </p>
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                        </div>
                        {activity.tag && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${activityColor}20`, 
                              color: activityColor 
                            }}>
                            {activity.tag}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Message to {data.name}
              </h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hey ${data.name}, I like your competitive programming profile!`}
                className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>
            <div className="px-6 py-3 bg-gray-50 rounded-b-lg flex justify-end">
              <button
                onClick={() => setShowMessageModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className={`px-4 py-2 rounded-md ${
                  message.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;