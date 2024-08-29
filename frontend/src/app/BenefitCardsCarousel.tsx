"use client"
import React from 'react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BenefitCardsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const benefitCards = [
    {
      heading: "Perfect Outfit Coordination",
      text: "Get personalized suggestions to match your existing wardrobe. Ensure your outfits are always cohesive and stylish.",
      imagePath: "/outfit-coordination.webp",
    },
    {
      heading: "Save Time, Style Effortlessly",
      text: "Quickly get tailored outfit suggestions, taking the guesswork out of getting dressed.",
      imagePath: "/images/time-saving.jpg",
    },
    {
      heading: "Build Your Fashion Confidence",
      text: "Feel reassured with expert-like advice. Our AI confirms your choices or offers stylish alternatives.",
      imagePath: "/images/confidence.jpg",
    },
    {
      heading: "Enhance Your Fashion Sense",
      text: "Learn about color theory and fashion coordination. Gradually improve your style with each use.",
      imagePath: "/images/learning-tool.jpg",
    },
    {
      heading: "Fashion Advice Anywhere, Anytime",
      text: "Access your AI stylist from anywhere. Perfect for quick advice before important events.",
      imagePath: "/images/accessibility.jpg",
    },
    {
      heading: "Share Your Style, Get Feedback",
      text: "Share your outfits on social media, engage with friends, and get feedback instantly.",
      imagePath: "/images/social-sharing.jpg",
    },
    {
      heading: "Shop the Look",
      text: "Discover new items from partnered fashion retailers directly through our platform.",
      imagePath: "/images/shop-the-look.jpg",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % benefitCards.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + benefitCards.length) % benefitCards.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full" data-carousel="slide">
      <div className="relative h-64 overflow-hidden rounded-lg md:h-96">
        {benefitCards.map((card, index) => (
          <div
            key={index}
            className={`absolute w-full h-full transition-opacity duration-700 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            data-carousel-item
          >
            <Image
              src={card.imagePath}
              alt={card.heading}
              layout="fill"
              objectFit="cover"
              className="absolute block w-full h-full"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4">
              <h3 className="text-2xl font-semibold mb-2">{card.heading}</h3>
              <p className="text-center">{card.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {benefitCards.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-current={index === currentSlide}
            aria-label={`Slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
          ></button>
        ))}
      </div>

      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};

export default BenefitCardsCarousel;