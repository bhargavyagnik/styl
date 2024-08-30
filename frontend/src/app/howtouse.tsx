'use client'
import React from 'react';
import { Camera, Shirt, Sparkles } from 'lucide-react';

const AIStylerFeatureHighlight = () => {
  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center">
        <div className="space-y-6 mb-10">
          <div className="flex items-center justify-center space-x-4">
            <Camera className="w-8 h-8  " />
            <Shirt className="w-8 h-8  " />
            <Sparkles className="w-8 h-8  " />
          </div>
          
          <p className="text-xl   leading-relaxed">
            Imagine you're at a store, trying on a stylish pair of black pants. 
            Curious about the perfect shirt to match? 
            Simply snap a photo, and let AI Stylist work its magic.
          </p>
        </div>
        
        <div className="bg-gray-100 p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold   mb-4">
            How It Works
          </h3>
          <ol className="text-left   space-y-4">
            <li className="flex items-start">
              <span className="font-bold mr-2">1.</span>
              Upload an image of the black pants you're considering.
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">2.</span>
              Our AI analyzes the style, fabric, and cut of the pants.
            </li>
            <li className="flex items-start">
              <span className="font-bold mr-2">3.</span>
              Receive personalized suggestions for complementary shirt colors and styles.
            </li>
          </ol>
        </div>
        
      </div>
    </div>
  );
};

export default AIStylerFeatureHighlight;