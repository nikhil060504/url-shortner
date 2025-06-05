import React, { useState, useEffect } from "react";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routes } from "./routing/routeTree.js";
import NavBar from "./components/NavBar.jsx";
import { getErrorMessage } from "./utils/errorHandler.js";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  const [currentRoute, setCurrentRoute] = useState("auth"); // 'home', 'dashboard', or 'auth'
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current route configuration
  const getCurrentRouteConfig = () => routes[currentRoute];
  const CurrentPageComponent = getCurrentRouteConfig()?.component;
  const currentRouteConfig = getCurrentRouteConfig();
  const requiresAuth = currentRouteConfig?.requiresAuth;

  // Check for existing user session on app load
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setCurrentRoute("home");
        }
      } catch (error) {
        console.error("Error loading user session:", getErrorMessage(error));
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, []);

  // Redirect to auth if route requires auth but user is not logged in
  useEffect(() => {
    if (requiresAuth && !user && !loading) {
      setCurrentRoute("auth");
    }
  }, [requiresAuth, user, loading]);

  const handleSwitchToHome = (userData) => {
    try {
      setUser(userData);
      setCurrentRoute("home");
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user session:", getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      setCurrentRoute("auth");
      localStorage.removeItem("user");
    } catch (error) {
      console.error("Error during logout:", getErrorMessage(error));
      setUser(null);
      setCurrentRoute("auth");
      localStorage.removeItem("user");
    }
  };

  const goToAuth = () => {
    setCurrentRoute("auth");
  };

  const goToDashboard = () => {
    setCurrentRoute("dashboard");
  };

  const goToHome = () => {
    setCurrentRoute("home");
  };

  // Show loading spinner while checking session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Show NavBar only when not on auth page */}
        {currentRoute !== "auth" && (
          <NavBar
            user={user}
            onLogout={handleLogout}
            onGoToAuth={goToAuth}
            onGoToDashboard={goToDashboard}
            onGoToHome={goToHome}
          />
        )}

        {/* Page Content */}
        <main>
          {CurrentPageComponent ? (
            <CurrentPageComponent
              user={user}
              onSwitchToHome={handleSwitchToHome}
              onLogout={handleLogout}
              onGoToAuth={goToAuth}
              onGoToDashboard={goToDashboard}
              onGoToHome={goToHome}
            />
          ) : (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center p-8 bg-white rounded-lg shadow">
                <h1 className="text-2xl font-bold text-red-600 mb-4">
                  Component Not Found
                </h1>
                <p className="text-gray-600 mt-2">
                  Current route: {currentRoute}
                </p>
                <p className="text-gray-600 mt-1">
                  Available routes: {Object.keys(routes).join(", ")}
                </p>
                <button
                  onClick={goToAuth}
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Go to Auth
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default App;
