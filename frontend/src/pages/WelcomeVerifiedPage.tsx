import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomeVerifiedPage: React.FC = () => {
  const navigate = useNavigate();
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setStartAnimation(true);

      const timer = setTimeout(() => {
        navigate("/signin");
      }, 1200);

      return () => clearTimeout(timer);
    }, 2000);
    return () => clearTimeout(firstTimer);
  }, [navigate]);

  return (
    <div
      className={`bg-gray-900 flex items-center justify-center min-h-screen pb-36 ${
        startAnimation ? "animate-fadeOut" : ""
      }`}
    >
      <div className="text-center">
        <img
          src="/cupidon_logo_app.png"
          alt="Website logo"
          className="mx-auto w-96 h-96 mb-4"
        />
        <p className="text-white text-4xl font-cursive">
          Welcome to Cupide ON,
        </p>
        <p className="text-white text-6xl font-cursive">
          Please verified your email, you will be redirected to signin page
          shortly
        </p>
      </div>
    </div>
  );
};

export default WelcomeVerifiedPage;
