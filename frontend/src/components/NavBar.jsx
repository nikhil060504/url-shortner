import React from "react";

const NavBar = ({
  user,
  onLogout,
  onGoToAuth,
  onGoToDashboard,
  onGoToHome,
}) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">ShortLink</h1>
          </div>

          <nav className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-6">
              <button
                onClick={onGoToHome}
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Home
              </button>
              {user && (
                <button
                  onClick={onGoToDashboard}
                  className="text-gray-600 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </button>
              )}
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                About
              </a>
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">
                    Welcome, {user.user?.name || user.name || "User"}!
                  </span>
                  <button
                    onClick={onLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={onGoToAuth}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 font-medium"
                >
                  Login / Register
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
