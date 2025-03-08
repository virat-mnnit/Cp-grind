import { useState, useEffect } from "react";
import { Search, Bell, Sun, Moon, User, MessageSquare } from "lucide-react";

export default function AppBar() {
  const [darkMode, setDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const users = ["Alice", "Bob", "Charlie", "David", "Eve", "Frank", "Grace"];
  const profile_options = ["Profile", "Settings", "Help", "Logout"];
  
  // Handle Dark Mode & Avoid SSR Issues
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 flex items-center justify-between relative">
      {/* Left Side: Empty Space for Centering */}
      <div className="w-1/4"></div>

      {/* Center: Search Bar */}
      <div className="relative flex-grow max-w-md">
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-4 py-2 pl-10 border rounded-full dark:bg-gray-800 dark:text-white focus:outline-none"
        />
        <Search
          className="absolute left-3 top-2.5 text-gray-500 dark:text-gray-300"
          size={20}
        />
      </div>

      {/* Right Side: Icons */}
      <div className="w-1/4 flex items-center justify-end gap-4">
        {/* Notification Icon */}
        <Bell
          className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-500"
          size={24}
        />

        {/* CHAT ICON AND DROPDOWN  */}

        <div className="relative">
          <MessageSquare
            className="text-gray-600 dark:text-gray-300 cursor-pointer hover:text-green-500"
            size={24}
            onClick={() => setChatOpen(!chatOpen)}
          />
          {chatOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              {users.map((user) => (
                <div
                  key={user}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => {
                    setSelectedUser(user);
                    setChatOpen(false);
                  }}
                >
                  {user}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}

        {darkMode ? (
          <Sun
            className="text-yellow-500 cursor-pointer"
            size={24}
            onClick={toggleDarkMode}
          />
        ) : (
          <Moon
            className="text-gray-700 dark:text-gray-300 cursor-pointer"
            size={24}
            onClick={toggleDarkMode}
          />
        )}

        {/* Profile Icon & Dropdown */}
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <User className="text-gray-700 dark:text-gray-300" size={24} />
          </div>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
              {profile_options.map((option) => (
                <div
                  key={option}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Window */}
      {selectedUser && (
        <div className="fixed bottom-5 right-5 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4">
          <div className="flex justify-between items-center border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Chat with {selectedUser}
            </h3>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
          <div className="h-40 overflow-y-auto p-2 text-gray-700 dark:text-gray-300">
            {/* Placeholder Messages */}
            <p>Hello, {selectedUser}! 👋</p>
           
          </div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      )}
    </nav>
  );
}