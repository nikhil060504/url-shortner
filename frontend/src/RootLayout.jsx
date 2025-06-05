import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "@tanstack/react-router";
import NavBar from "./components/NavBar";
import { getErrorMessage } from "./utils/errorHandler";

const RootLayout = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for existing user session on app load
  useEffect(() => {
    const checkUserSession = () => {
      try {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          // If user is logged in and on auth page, redirect to home
          if (location.pathname === "/auth") {
            navigate({ to: "/" });
          }
        } else {
          // If no user and not on auth page, redirect to auth
          if (location.pathname !== "/auth") {
            navigate({ to: "/auth" });
          }
        }
      } catch (error) {
        console.error("Error loading user session:", getErrorMessage(error));
        localStorage.removeItem("user");
        navigate({ to: "/auth" });
      } finally {
        setLoading(false);
      }
    };

    checkUserSession();
  }, [navigate, location.pathname]);

  const handleSwitchToHome = (userData) => {
    try {
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate({ to: "/" });
    } catch (error) {
      console.error("Error saving user session:", getErrorMessage(error));
    }
  };

  const handleLogout = async () => {
    try {
      setUser(null);
      localStorage.removeItem("user");
      navigate({ to: "/auth" });
    } catch (error) {
      console.error("Error during logout:", getErrorMessage(error));
      setUser(null);
      localStorage.removeItem("user");
      navigate({ to: "/auth" });
    }
  };

  const goToAuth = () => {
    navigate({ to: "/auth" });
  };

  const goToDashboard = () => {
    navigate({ to: "/dashboard" });
  };

  const goToHome = () => {
    navigate({ to: "/" });
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Only show NavBar on authenticated pages */}
      {location.pathname !== "/auth" && (
        <NavBar
          user={user}
          onLogout={handleLogout}
          onGoToAuth={goToAuth}
          onGoToDashboard={goToDashboard}
          onGoToHome={goToHome}
        />
      )}

      <main>
        <Outlet
          context={{
            user,
            onSwitchToHome: handleSwitchToHome,
            onLogout: handleLogout,
            onGoToAuth: goToAuth,
            onGoToDashboard: goToDashboard,
            onGoToHome: goToHome,
          }}
        />
      </main>
    </div>
  );
};

export default RootLayout;
