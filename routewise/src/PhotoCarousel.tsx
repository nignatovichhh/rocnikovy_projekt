import React, { useState } from "react";
import "./styles/PhotoCarousel.css";

interface PhotoCarouselProps {
    images: string[];
}

function PhotoCarousel({ images }: PhotoCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prevImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    const nextImage = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <div className="carousel-container">
            {images.length > 0 ? (
                <>
                    <button className="arrow left-arrow" onClick={prevImage}>
                        &lt;
                    </button>
                    <div className="image-container">
                        <img src={images[currentIndex]} alt={`image-${currentIndex}`} />
                    </div>
                    <button className="arrow right-arrow" onClick={nextImage}>
                        &gt;
                    </button>
                    <div className="image-indicator">
                        {currentIndex + 1} / {images.length}
                    </div>
                </>) : (
                <div className="empty-container">
                    <span>-</span>
                </div>
            )}
        </div>
    );
};

export default PhotoCarousel;
