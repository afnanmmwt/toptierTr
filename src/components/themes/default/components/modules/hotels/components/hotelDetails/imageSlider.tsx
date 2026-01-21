
"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

const ImageSlider = ({ testimonials }: { testimonials: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slidesToShow, setSlidesToShow] = useState(3);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSlides = () => {
      if (window.innerWidth < 768) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(2);
      } else {
        setSlidesToShow(3);
      }
    };

    updateSlides();
    window.addEventListener("resize", updateSlides);
    return () => window.removeEventListener("resize", updateSlides);
  }, []);

  const goToNext = () => {
    if (isAnimating || !testimonials?.length) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex >= testimonials.length - slidesToShow ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 500);
  };

  const goToPrev = () => {
    if (isAnimating || !testimonials?.length) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? testimonials.length - slidesToShow : prevIndex - 1
      );
      setIsAnimating(false);
    }, 500);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeThreshold = 50;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set([...Array.from(prev), index]));
  };

  const getImageUrl = (testimonial: any, index: number) => {
    const defaultImage = "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D";
    if (failedImages.has(index) || !testimonial) {
      return defaultImage;
    }
    return testimonial;
  };

  const getTransformValue = () => {
    return -(currentIndex * (100 / slidesToShow));
  };

  if (!testimonials?.length) {
    return null;
  }

  return (
    <div className="max-w-[1200px] mx-auto py-8 sm:py-12 lg:py-16 relative px-4">
      <div
        className="overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
      >
        <div
          className={`flex transition-transform duration-500 ease-in-out ${isAnimating ? "pointer-events-none" : ""}`}
          style={{
            transform: `translateX(${getTransformValue()}%)`,
            width: slidesToShow === 1 ? '100%' : 'auto', // ⬅️ Conditional width
          }}
        >
          {testimonials.map((testimonial: any, index: number) => (
            <div
              key={index}
              className="flex-shrink-0 px-2"
              style={{
                width: slidesToShow === 1 ? '100%' : '500px', // ⬅️ Conditional width
              }}
            >
              <div
                className="relative h-[300px] rounded-2xl overflow-hidden"
                style={{
                  width: slidesToShow === 1 ? '100%' : '480px', // ⬅️ Conditional width
                }}
              >
                <Image
                  src={getImageUrl(testimonial, index)}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-cover !w-full !h-full"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33.333vw"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAfFcSJYYAAAAJ0lEQVR42mNkYPhfDwAChwG/yN8eIAAAAABJRU5ErkJggg=="
                  onError={() => handleImageError(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {currentIndex > 0 && (
        <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-8 z-20">
          <button
            onClick={goToPrev}
            disabled={isAnimating}
            className="bg-[#E5E5E5] shadow-xl rotate-180 cursor-pointer rounded-full p-2 sm:p-4 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            <svg width="13" height="13" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_358_2931)">
                <g clip-path="url(#clip1_358_2931)">
                  <g clip-path="url(#clip2_358_2931)">
                    <path d="M0.333984 5.83724H10.4757L7.49232 8.82891L8.66732 10.0039L12.9602 5.71101C13.3507 5.32049 13.3507 4.68732 12.9602 4.2968L8.66732 0.00390625L7.49232 1.17891L10.4757 4.17057H0.333985L0.333984 5.83724Z" fill="#0F1112" />
                  </g>
                </g>
              </g>
              <defs>
                <clipPath id="clip0_358_2931">
                  <rect width="14" height="10" fill="white" />
                </clipPath>
                <clipPath id="clip1_358_2931">
                  <rect width="14" height="10" fill="white" />
                </clipPath>
                <clipPath id="clip2_358_2931">
                  <rect width="14" height="10" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      )}

      <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-7 z-20">
        <button
          onClick={goToNext}
          disabled={isAnimating}
          className="bg-[#E5E5E5] shadow-xl cursor-pointer rounded-full p-2 sm:p-4 hover:bg-gray-300 transition-colors disabled:opacity-50"
        >
          <svg width="13" height="13" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_358_2931)">
              <g clipPath="url(#clip1_358_2931)">
                <g clipPath="url(#clip2_358_2931)">
                  <path d="M0.333984 5.83724H10.4757L7.49232 8.82891L8.66732 10.0039L12.9602 5.71101C13.3507 5.32049 13.3507 4.68732 12.9602 4.2968L8.66732 0.00390625L7.49232 1.17891L10.4757 4.17057H0.333985L0.333984 5.83724Z" fill="#0F1112" />
                </g>
              </g>
            </g>
            <defs>
              <clipPath id="clip0_358_2931">
                <rect width="14" height="10" fill="white" />
              </clipPath>
              <clipPath id="clip1_358_2931">
                <rect width="14" height="10" fill="white" />
              </clipPath>
              <clipPath id="clip2_358_2931">
                <rect width="14" height="10" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </button>
      </div>

      {/* Dots nav (mobile only) */}
      <div className="flex md:hidden justify-center mt-6 gap-2">
        {testimonials.map((_: any, index: number) => (
          <button
            key={index}
            onClick={() => !isAnimating && setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? "bg-gray-800" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;