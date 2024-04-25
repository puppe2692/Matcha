import React, { useState } from "react";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const nextSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };
  const prevSlide = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="relative w-full h-96">
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full flex justify-between">
        <button
          onClick={prevSlide}
          className="bg-gray-800 bg-opacity-50 text-white p-2 rounded-lg"
        >
          Previous
        </button>
        <img
          src={images[activeIndex]}
          alt="carousel"
          className="w-full h-full object-cover"
        />
        <button
          onClick={nextSlide}
          className="bg-gray-800 bg-opacity-50 text-white p-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousel;
