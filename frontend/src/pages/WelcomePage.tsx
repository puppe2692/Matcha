import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const firstTimer = setTimeout(() => {
      setStartAnimation(true);

      const timer = setTimeout(() => {
        navigate("/");
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
        <p className="text-white text-4xl font-cursive">
          where money can buy you looooooooooooooove
        </p>
        <p className="text-white text-xs font-cursive mt-10">
          You will be redirected shortly
        </p>
      </div>
    </div>
  );
};

export default WelcomePage;
