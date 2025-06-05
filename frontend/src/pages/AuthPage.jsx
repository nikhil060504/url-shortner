import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

const AuthPage = ({ onSwitchToHome }) => {
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (userData) => {
    console.log("Authentication successful:", userData);
    if (onSwitchToHome) {
      onSwitchToHome(userData);
    }
  };

  const switchToRegister = () => {
    setIsLogin(false);
  };

  const switchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <div>
      {isLogin ? (
        <LoginForm
          onSuccess={handleAuthSuccess}
          onSwitchToRegister={switchToRegister}
        />
      ) : (
        <RegisterForm
          onSuccess={handleAuthSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )}
    </div>
  );
};

export default AuthPage;
