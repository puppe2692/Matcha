import React, { useState } from "react";
import { ArrowBigLeft, ArrowBigRight, Circle, CircleDot } from "lucide-react";
import "./image-slider.css";

interface CarouselProps {
  images: string[];
}

const ImageSlider: React.FC<CarouselProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const showNextImage = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const showPreviousImage = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            className="img-slider-img"
            style={{ translate: `${-100 * activeIndex}%` }}
          />
        ))}
      </div>
      <button
        onClick={showNextImage}
        className="img-slider-btn"
        style={{ left: 0 }}
      >
        <ArrowBigLeft />
      </button>
      <button
        onClick={showPreviousImage}
        className="img-slider-btn"
        style={{ right: 0 }}
      >
        <ArrowBigRight />
      </button>
      <div
        style={{
          position: "absolute",
          bottom: ".5rem",
          left: "50%",
          translate: "-50%",
          display: "flex",
          gap: ".25rem",
        }}
      >
        {images.map((_, index) => (
          <button
            key={index}
            className="img-slider-dot-btn"
            onClick={() => setActiveIndex(index)}
          >
            {index === activeIndex ? <CircleDot /> : <Circle />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
