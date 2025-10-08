// LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const goToStore = () => {
    navigate("/digitalinkk/store");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6">
      <h1 className="text-5xl font-bold mb-6 text-center">
        Welcome to Digitalinkk
      </h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Discover our exclusive products and make your shopping experience seamless. 
        Click below to visit our store and checkout amazing deals!
      </p>
      <button
        onClick={goToStore}
        className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition duration-300"
      >
        Go to Store
      </button>
    </div>
  );
};

export default LandingPage;
