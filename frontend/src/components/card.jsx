import React, { useState, useEffect, useRef } from 'react';
import { Bell, MessageSquare, ThumbsUp, Share2, MoreHorizontal, TrendingUp, Award } from 'lucide-react';

const Card = ({ 
  user,
  engagement: initialEngagement,
  onLikeClick,
  onCommentClick,
  onShareClick,
  onMoreOptionsClick,
  onProfileClick,
  darkMode,
  prevScore,
  finalScore,
}) => {
  // State to track likes and comments
  const [engagement, setEngagement] = useState(initialEngagement || {
    likeCount: 0,
    commentCount: 0,
    shareCount: 0
  });
  
  // State to track if the current user has liked the post
  const [isLiked, setIsLiked] = useState(false);
  
  // State for comment input visibility and text
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  
  // State for animation control
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [commentSectionHeight, setCommentSectionHeight] = useState(0);
  
  // Score animation states
  const [currentScore, setCurrentScore] = useState(prevScore); // Use the prop directly
  const [isScoreAnimating, setIsScoreAnimating] = useState(false);
  const [showScoreChange, setShowScoreChange] = useState(false);
  const scoreChangeTimeout = useRef(null);
  const animationFrameRef = useRef(null);

  // Effect to handle score animation when component mounts
  useEffect(() => {
    // Trigger the score animation after a delay
    setTimeout(() => {
      animateScore();
    }, 1500);

    return () => {
      clearTimeout(scoreChangeTimeout.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Function to animate the score from prevScore to finalScore
  const animateScore = () => {
    setIsScoreAnimating(true);
    setShowScoreChange(true);
    
    // Use props directly instead of scoreData object
    const duration = 1500; // ms
    const start = performance.now();
    
    const animate = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = t => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      // Calculate the current score value using props
      const scoreValue = Math.round(prevScore + easedProgress * (finalScore - prevScore));
      setCurrentScore(scoreValue);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation completed
        scoreChangeTimeout.current = setTimeout(() => {
          setIsScoreAnimating(false);
        }, 500);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle like button click with animation
  const handleLikeClick = () => {
    // Start like animation
    setIsLikeAnimating(true);
    
    // Toggle like state
    setIsLiked(!isLiked);
    
    // Update like count with a slight delay to sync with animation
    setTimeout(() => {
      setEngagement(prev => ({
        ...prev,
        likeCount: isLiked ? Math.max(0, prev.likeCount - 1) : prev.likeCount + 1
      }));
      
      // End animation after changes applied
      setTimeout(() => setIsLikeAnimating(false), 300);
      
      // Call the parent component callback if provided
      if (onLikeClick) {
        onLikeClick(!isLiked);
      }
    }, 150);
  };

  // Handle comment button click with animation
  const handleCommentClick = () => {
    // Toggle comment input visibility with smooth animation
    setShowCommentInput(!showCommentInput);
    setCommentSectionHeight(showCommentInput ? 0 : 'auto');
    
    // Call the parent component callback if provided
    if (onCommentClick) {
      onCommentClick();
    }
  };

  // Handle submitting a comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (commentText.trim()) {
      // Add the new comment with animation
      const newComment = {
        id: Date.now(),
        text: commentText,
        author: 'You', // Placeholder - would use actual user info in a real app
        timestamp: 'Just now',
        isNew: true // Flag for animation
      };
      
      setComments([...comments, newComment]);
      
      // After a delay, remove the "new" flag
      setTimeout(() => {
        setComments(prev => 
          prev.map(comment => 
            comment.id === newComment.id 
              ? { ...comment, isNew: false } 
              : comment
          )
        );
      }, 500);
      
      // Update comment count with animation
      setEngagement(prev => ({
        ...prev,
        commentCount: prev.commentCount + 1
      }));
      
      // Clear the input
      setCommentText('');
    }
  };

  // Handle share button click with animation
  const handleShareClick = () => {
    // Create a temporary animation state
    const [isSharing, setIsSharing] = useState(false);
    setIsSharing(true);
    
    // Update share count with animation timing
    setTimeout(() => {
      setEngagement(prev => ({
        ...prev,
        shareCount: prev.shareCount + 1
      }));
      
      // Reset animation state
      setTimeout(() => setIsSharing(false), 300);
      
      // Call the parent component callback if provided
      if (onShareClick) {
        onShareClick();
      }
    }, 150);
  };

  // Dark mode class sets
  const darkModeClasses = {
    cardOuter: darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-white to-gray-50",
    cardInner: darkMode ? "bg-gray-800" : "bg-white",
    userNameGradient: darkMode 
      ? "from-gray-100 to-gray-400" 
      : "from-gray-900 to-gray-600",
    userNameHoverGradient: darkMode 
      ? "hover:from-blue-300 hover:to-indigo-300" 
      : "hover:from-indigo-600 hover:to-purple-600",
    userTitle: darkMode ? "text-gray-400" : "text-gray-500",
    timePostedBg: darkMode ? "bg-gray-700" : "bg-gray-100",
    timePostedText: darkMode ? "text-gray-300" : "text-gray-400",
    timePostedDot: darkMode ? "bg-gray-300" : "bg-gray-400",
    scoreBg: darkMode ? "bg-blue-900" : "bg-blue-50",
    scoreText: darkMode ? "text-blue-300" : "text-blue-600",
    scoreDot: darkMode ? "bg-blue-300" : "bg-blue-500",
    moreOptionsIcon: darkMode ? "text-gray-300 hover:text-blue-300 hover:bg-gray-700" : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50",
    contentBg: darkMode ? "bg-gray-700" : "bg-gray-50",
    contentText: darkMode ? "text-white" : "text-gray-700",
    engagementLikeBg: darkMode ? "from-blue-900 to-indigo-900" : "from-blue-50 to-indigo-50",
    engagementLikeText: darkMode ? "text-blue-300" : "text-blue-700",
    engagementIconBg: darkMode ? "from-blue-600 to-indigo-700" : "from-blue-500 to-indigo-600",
    countBg: darkMode ? "bg-gray-700" : "bg-gray-100", 
    countText: darkMode ? "text-gray-300" : "text-gray-700",
    countIcon: darkMode ? "text-gray-300" : "text-gray-500",
    actionBorder: darkMode ? "border-gray-700" : "border-gray-100",
    actionButtonBg: darkMode ? "bg-gray-700" : "bg-gray-100",
    actionButtonText: darkMode ? "text-gray-300" : "text-gray-700",
    actionButtonHoverBg: darkMode ? "hover:bg-blue-600" : "hover:bg-blue-500",
    // New classes for comments section
    commentInput: darkMode ? "bg-gray-700 text-white" : "bg-white text-gray-700",
    commentInputBorder: darkMode ? "border-gray-600" : "border-gray-200",
    commentButton: darkMode ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400",
    commentItem: darkMode ? "bg-gray-700" : "bg-gray-50",
    commentAuthor: darkMode ? "text-blue-300" : "text-blue-600",
    commentTimestamp: darkMode ? "text-gray-400" : "text-gray-500",
    commentText: darkMode ? "text-white" : "text-gray-700",
    // Active button states
    activeButton: darkMode ? "bg-blue-700 text-white" : "bg-blue-500 text-white",
    // Score animation colors
    prevScoreColor: darkMode ? "text-amber-300" : "text-amber-500",
    finalScoreColor: darkMode ? "text-green-300" : "text-green-600",
    scoreDiffPositive: darkMode ? "text-green-300" : "text-green-500",
    scoreDiffNegative: darkMode ? "text-red-300" : "text-red-500",
    scoreCardBg: darkMode ? "bg-gray-700" : "bg-gray-50",
    scoreGlowPositive: darkMode ? "shadow-green-400/20" : "shadow-green-500/20",
    scoreGlowNegative: darkMode ? "shadow-red-400/20" : "shadow-red-500/20",
  };
  
  return (
    <div className={`max-w-lg ${darkModeClasses.cardOuter} rounded-3xl shadow-xl overflow-hidden border-0 p-1`}>
      <div className={`${darkModeClasses.cardInner} rounded-2xl overflow-hidden`}>
        {/* Header with profile info */}
        {user && (
          <div className="pt-4 px-4 pb-2 flex items-center">
            {/* Avatar */}
            {(user.initials || user.avatarImage) && (
              <div 
                className={`relative group h-14 w-14 ${user.avatarColor || 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'} rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-lg transform transition-all duration-300 ${onProfileClick ? 'cursor-pointer hover:scale-105 hover:rotate-3' : ''}`}
                onClick={onProfileClick}
              >
                {user.avatarImage ? (
                  <img src={user.avatarImage} alt={user.name || "User"} className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  <span className="drop-shadow-md">{user.initials}</span>
                )}
                <div className="absolute inset-0 rounded-2xl bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            )}
            
            <div className="ml-3 flex-grow">
              <div className="flex justify-between items-start">
                <div>
                  {user.name && (
                    <h3 
                      className={`font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${darkModeClasses.userNameGradient} text-lg tracking-tight ${onProfileClick ? `cursor-pointer ${darkModeClasses.userNameHoverGradient} transition-all duration-300` : ''}`} 
                      onClick={onProfileClick}
                    >
                      {user.name}
                    </h3>
                  )}
                  
                  {user.title && (
                    <p className={`text-sm font-medium ${darkModeClasses.userTitle} mt-0.5`}>{user.title}</p>
                  )}
                  
                  {(user.timePosted || user.score !== undefined) && (
                    <div className="flex items-center text-xs mt-1">
                      {user.timePosted && (
                        <span className={`flex items-center ${darkModeClasses.timePostedText} ${darkModeClasses.timePostedBg} px-2 py-0.5 rounded-full`}>
                          <span className={`w-1 h-1 ${darkModeClasses.timePostedDot} rounded-full mr-1`}></span>
                          {user.timePosted}
                        </span>
                      )}
                      
                      {user.timePosted && user.score !== undefined && <span className="mx-1"></span>}
                      
                      {user.score !== undefined && (
                        <span className={`flex items-center ${darkModeClasses.scoreText} font-semibold ${darkModeClasses.scoreBg} px-2 py-0.5 rounded-full`}>
                          <span className={`w-1 h-1 ${darkModeClasses.scoreDot} rounded-full mr-1`}></span>
                          Score: {user.score}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center">
                  {onMoreOptionsClick && (
                    <button 
                      className={`${darkModeClasses.moreOptionsIcon} p-1 rounded-full transition-all duration-300 transform hover:rotate-90`}
                      onClick={onMoreOptionsClick}
                      aria-label="More options"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content - Score Animation Component */}
        <div className="px-4 py-2">
          <div className={`${darkModeClasses.contentBg} rounded-xl p-4 shadow-inner relative overflow-hidden`}>
            {/* Score Card with Animation */}
            <div className="flex flex-col items-center justify-center py-2">
              <div className="text-center mb-3">
                <h3 className={`text-sm font-semibold ${darkModeClasses.contentText} mb-1`}>Performance Score</h3>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`text-sm ${darkModeClasses.prevScoreColor} transition-opacity duration-300 ${isScoreAnimating ? 'opacity-70' : ''}`}>
                    Previous: {prevScore}
                  </span>
                  
                  {showScoreChange && (
                    <span className={`text-sm font-bold ${finalScore > prevScore ? darkModeClasses.scoreDiffPositive : darkModeClasses.scoreDiffNegative}`}>
                      {finalScore > prevScore ? '↑' : '↓'} 
                      {Math.abs(finalScore - prevScore)}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Main Score Display with Animation */}
              <div 
                className={`relative h-32 w-32 rounded-full flex items-center justify-center transition-all duration-500 ease-out
                  ${isScoreAnimating ? (finalScore > prevScore ? 
                    `shadow-lg ${darkModeClasses.scoreGlowPositive}` : 
                    `shadow-lg ${darkModeClasses.scoreGlowNegative}`) : ''}`}
              >
                {/* Background Circle */}
                <div className="absolute inset-0 rounded-full border-8 border-gray-200 dark:border-gray-700 opacity-30"></div>
                
                {/* Progress Circle - Animated */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="46" 
                    fill="none" 
                    stroke={darkMode ? "#334155" : "#e2e8f0"} 
                    strokeWidth="8" 
                  />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="46" 
                    fill="none" 
                    stroke={currentScore >= 90 ? (darkMode ? "#4ade80" : "#22c55e") : 
                           currentScore >= 70 ? (darkMode ? "#facc15" : "#eab308") : 
                           (darkMode ? "#f87171" : "#ef4444")} 
                    strokeWidth="8" 
                    strokeDasharray={`${2.89 * currentScore} 289`}
                    strokeDashoffset="0" 
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    className="transition-all duration-200"
                  />
                </svg>
                
                {/* Score Number */}
                <div className="text-center relative z-10">
                  <span className={`text-4xl font-bold ${darkModeClasses.contentText} transition-all duration-300 ${isScoreAnimating ? 'scale-110' : ''}`} 
                        style={{ 
                          display: 'inline-block',
                          transform: isScoreAnimating ? 'scale(1.1)' : 'scale(1)'
                        }}>
                    {currentScore}
                  </span>
                </div>
                
                {/* Icon indicator */}
                <div className={`absolute -bottom-1 bg-white dark:bg-gray-800 rounded-full p-1.5 border-2 ${finalScore > prevScore ? 'border-green-500' : 'border-red-500'} transition-all duration-500 ${isScoreAnimating ? 'opacity-100' : 'opacity-0'}`}>
                  {finalScore > prevScore ? 
                    <TrendingUp size={16} className="text-green-500" /> : 
                    <TrendingUp size={16} className="text-red-500 transform rotate-180" />
                  }
                </div>
              </div>
              
              {/* Award indicator when score reaches final value */}
              <div className={`mt-3 flex items-center justify-center transition-all duration-500 ${currentScore === finalScore && finalScore >= 90 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                <Award size={20} className="text-amber-500 mr-1" />
                <span className={`text-sm font-semibold ${finalScore >= 90 ? 'text-amber-500' : darkModeClasses.contentText}`}>
                  {finalScore >= 90 ? 'Excellent Performance!' : 
                   finalScore >= 70 ? 'Good Performance' : 'Needs Improvement'}
                </span>
              </div>
            </div>
            
            {/* Removed the children render section that was here */}
          </div>
        </div>

        {/* Engagement stats - with animation classes */}
        {engagement && (
          <div className="px-4 py-2">
            <div className="flex items-center">
              {engagement.likeCount !== undefined && (
                <div className={`flex items-center bg-gradient-to-r ${darkModeClasses.engagementLikeBg} px-2 py-1 rounded-full transition-all duration-300 ${isLikeAnimating ? 'scale-110' : ''}`}>
                  <div className={`bg-gradient-to-r ${darkModeClasses.engagementIconBg} text-white rounded-full h-5 w-5 flex items-center justify-center shadow-md transition-transform duration-300 ${isLikeAnimating ? 'scale-110' : ''}`}>
                    <ThumbsUp size={10} className={`transition-transform duration-300 ${isLikeAnimating ? 'scale-110' : ''}`} />
                  </div>
                  <span className={`ml-1.5 font-semibold ${darkModeClasses.engagementLikeText} transition-all duration-300 ${isLikeAnimating ? 'font-bold' : ''}`}>{engagement.likeCount}</span>
                </div>
              )}
              
              {(engagement.commentCount !== undefined || engagement.shareCount !== undefined) && (
                <div className="ml-auto">
                  {engagement.commentCount !== undefined && (
                    <span className={`inline-flex items-center ${darkModeClasses.countBg} px-2 py-1 rounded-full ${darkModeClasses.countText} font-medium text-xs mr-1.5 transition-all duration-300`}>
                      <MessageSquare size={12} className={`mr-1 ${darkModeClasses.countIcon}`} /> 
                      {engagement.commentCount}
                    </span>
                  )}
                  
                  {engagement.shareCount !== undefined && (
                    <span className={`inline-flex items-center ${darkModeClasses.countBg} px-2 py-1 rounded-full ${darkModeClasses.countText} font-medium text-xs transition-all duration-300`}>
                      <Share2 size={12} className={`mr-1 ${darkModeClasses.countIcon}`} />
                      {engagement.shareCount}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action buttons - with enhanced animations */}
        <div className={`px-4 py-2 border-t ${darkModeClasses.actionBorder} flex justify-between gap-2`}>
          <button 
            className={`flex items-center justify-center rounded-lg p-2 font-medium text-sm flex-1 transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow ${isLiked ? darkModeClasses.activeButton : `${darkModeClasses.actionButtonText} ${darkModeClasses.actionButtonBg} ${darkModeClasses.actionButtonHoverBg} hover:text-white`}`}
            onClick={handleLikeClick}
            aria-label="Like"
          >
            <ThumbsUp 
              size={16} 
              className={`mr-1.5 ${isLiked ? 'fill-current' : ''} transition-all duration-300 ${isLikeAnimating ? 'scale-125 rotate-12' : ''}`} 
            />
            <span className="transition-all duration-300">{isLiked ? 'Liked' : 'Like'}</span>
          </button>
          
          <button 
            className={`flex items-center justify-center rounded-lg p-2 font-medium text-sm flex-1 transition-all duration-300 transform active:scale-95 shadow-sm hover:shadow ${showCommentInput ? darkModeClasses.activeButton : `${darkModeClasses.actionButtonText} ${darkModeClasses.actionButtonBg} ${darkModeClasses.actionButtonHoverBg} hover:text-white`}`}
            onClick={handleCommentClick}
            aria-label="Comment"
          >
            <MessageSquare 
              size={16} 
              className={`mr-1.5 transition-all duration-300 ${showCommentInput ? 'scale-110' : ''}`} 
            />
            <span className="transition-all duration-300">Comment</span>
          </button>
          
          {onShareClick && (
            <button 
              className={`flex items-center justify-center ${darkModeClasses.actionButtonText} ${darkModeClasses.actionButtonBg} ${darkModeClasses.actionButtonHoverBg} hover:text-white rounded-lg p-2 font-medium text-sm flex-1 transition-all duration-300 transform active:scale-95 hover:scale-105 shadow-sm hover:shadow`}
              onClick={handleShareClick}
              aria-label="Share"
            >
              <Share2 size={16} className="mr-1.5 transition-all duration-300" />
              <span className="transition-all duration-300">Share</span>
            </button>
          )}
        </div>

        {/* Comments section - with smooth height transition */}
        <div 
          className={`overflow-hidden transition-all duration-500 ease-in-out ${showCommentInput ? 'max-h-96' : 'max-h-0'}`}
          style={{ opacity: showCommentInput ? 1 : 0 }}
        >
          <div className={`px-4 py-3 border-t ${darkModeClasses.actionBorder}`}>
            {/* Comment input form with animation */}
            <form onSubmit={handleCommentSubmit} className="mb-3 transform transition-all duration-300 ease-out">
              <div className="flex">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className={`flex-grow ${darkModeClasses.commentInput} ${darkModeClasses.commentInputBorder} border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300`}
                  autoFocus={showCommentInput}
                />
                <button 
                  type="submit"
                  className={`${darkModeClasses.commentButton} text-white px-4 py-2 rounded-r-lg transition-all duration-300 ${!commentText.trim() ? 'opacity-70' : 'hover:scale-105'}`}
                  disabled={!commentText.trim()}
                >
                  Post
                </button>
              </div>
            </form>
            
            {/* Comments list with animation for new comments */}
            {comments.length > 0 && (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {comments.map(comment => (
                  <div 
                    key={comment.id} 
                    className={`${darkModeClasses.commentItem} rounded-lg p-2 shadow-sm transition-all duration-500 ${comment.isNew ? 'transform translate-y-1 opacity-0 animate-fade-in-up' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className={`${darkModeClasses.commentAuthor} font-semibold text-sm`}>{comment.author}</span>
                      <span className={`${darkModeClasses.commentTimestamp} text-xs`}>{comment.timestamp}</span>
                    </div>
                    <p className={`${darkModeClasses.commentText} text-sm`}>{comment.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your global CSS or as a style tag
const globalStyles = `
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse {
  animation: pulse 2s infinite;
}
`;

export default Card;