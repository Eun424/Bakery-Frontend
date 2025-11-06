import { useState, useEffect } from "react";
import { GiCroissant, GiCupcake } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";

// Import images
import bakery1 from "../assets/images/Bakery-1.jpeg";
import bakery2 from "../assets/images/Bakery-2.jpeg";
import bakery3 from "../assets/images/Bakery-3.jpeg";
import bakery4 from "../assets/images/Bakery-4.jpeg";
import bakery5 from "../assets/images/Bakery-5.jpeg";
import bakery6 from "../assets/images/Bakery-6.jpeg";
import bakery7 from "../assets/images/Bakery-7.jpeg";
import bakery8 from "../assets/images/Bakery-8.jpeg";
import bakery9 from "../assets/images/Bakery-9.jpeg";
import bakery10 from "../assets/images/Samosa.jpeg";

import logo from "../assets/images/Bee_s_Bakery.png";

const images = [
  bakery1,
  bakery2,
  bakery3,
  bakery4,
  bakery5,
  bakery6,
  bakery7,
  bakery8,
  bakery9,
  bakery10,
];

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fade-in effect
  useEffect(() => {
    const timer = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full font-poppins overflow-hidden">
      {/* Full-screen slideshow */}
      <img
        src={images[currentImage]}
        alt="Bakery"
        className="absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000"
      />

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-0"></div>

      {/* Top: Logo */}
      <div className="absolute top-5 left-5 z-20">
        <div
          className="flex items-center justify-center rounded-full p-4"
          style={{ backgroundColor: "#FF8C42" }}
        >
          <img
            src={logo}
            alt="Bakery Logo"
            className="h-28 w-28 object-contain"
          />
        </div>
      </div>

      {/* Center Content */}
      <div
        className={`absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-20 transition-opacity duration-1000 ${
          fadeIn ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-sansita font-bold mb-4 leading-tight flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-white">
          <span className="flex items-center gap-2">
            <GiCroissant className="text-[#FF8C42] text-3xl sm:text-4xl" />
            Welcome to your
          </span>
          <span>Bakery Manager</span>
        </h1>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl mb-6 font-poppins flex items-center justify-center gap-2 text-white">
          <GiCupcake className="text-[#FF8C42] text-xl sm:text-2xl" />
          Manage your bakery orders, track expenses, and delight your customers.
        </p>

        {/* Button */}
        <button
          onClick={() => (window.location.href = "/login")}
          className="bg-[#933C24] text-[#F5F5F5] px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-[#a14830] hover:scale-105 flex items-center gap-2 transition-transform duration-300 text-sm sm:text-base md:text-lg"
        >
          Go to Dashboard <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
