"use client"
import React from 'react';
import { Clock, Palette, Zap, Smartphone } from 'lucide-react';

const WhyUseAIStylist = () => {
  const benefits = [
    {
      icon: <Clock className="w-8 h-8  " />,
      heading: "Save Time, Style Effortlessly",
      text: "Dont waste time browsing Pinterest or Instagram for outfit ideas. Get instant suggestions tailored to your style."
    },
    {
      icon: <Palette className="w-8 h-8  " />,
      heading: "Perfect Outfit Coordination",
      text: "Receive personalized suggestions to match your existing wardrobe, ensuring cohesive and stylish outfits."
    },
    {
      icon: <Zap className="w-8 h-8  " />,
      heading: "Enhance Your Fashion Sense",
      text: "Get tailored outfit suggestions thus, improving your percieved fashion sense."
    },
    {
      icon: <Smartphone className="w-8 h-8  " />,
      heading: "Fashion Advice Anywhere",
      text: "Access your AI stylist from anywhere, perfect for quick advice before important events."
    }
  ];

  return (
    <div className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl   md:text-7xl text-center mb-12">
          Why Use AI Stylist
        </h1>
        {/* <h2 className="text-large   md:text-2xl text-center mb-12">
          Suppose you are at a store trying out a black pant and you want to know what color of shirt will go with it. You can use AI Stylist to upload the image of the pant and get suggestions for the shirt color.
          This is just one of the many ways you can use AI Stylist to enhance your shopping experience.
        </h2> */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-medium   mb-2">{benefit.heading}</h3>
              <p className="text-base  ">{benefit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyUseAIStylist;