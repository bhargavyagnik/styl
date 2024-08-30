'use client'
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between items-center w-full text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg font-medium  ">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5  " />
        ) : (
          <ChevronDown className="w-5 h-5  " />
        )}
      </button>
      {isOpen && (
        <div className="mt-2  ">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const AIStylerFAQ = () => {
  const faqs = [
    {
      question: "Is AI Stylist free to use?",
      answer: "Yes, AI Stylist is completely free. Simply upload an image and choose an accessory to get started with our AI-powered recommendations."
    },
    {
      question: "How does AI Stylist work?",
      answer: "AI Stylist uses Image + Text AI to analyze your uploaded image which analyzes gender, accessory, physical characteristics of a person to suggest clothes. It then searches for specific products from selected brands to match your style."
    },
    {
      question: "Can I choose specific brands for the search?",
      answer: "Currently, we have limited the brand selection to test customer preferences. We plan to collaborate with more brands in the future to expand our search capabilities and maximize user experience."
    },
    {
      question: "How can I use AI Stylist when shopping?",
      answer: "Simply upload an image of a clothing item you're considering, like a shirt. Our AI will analyze it and suggest combinations of specific items, such as pant colors for styles that could look good."
    },
    {
      question: "What types of recommendations does AI Stylist provide?",
      answer: "AI Stylist offers suggestions for various clothing items and accessories, including shirts, footwear, sunglasses. You can also request preferences of styles like casual, formal, sporty, etc. For more special requests, please reach out to us at contact@bhargavyagnik.com"
    },
    {
      question: "How can brands collaborate with AI Stylist?",
      answer: "If you're a brand interested in being featured in our recommendations, please reach out to us at contact@bhargavyagnik.com for collaboration opportunities."
    },
    {
      question: "I am worried about privacy. How does AI Stylist handle my data?",
      answer: "We take privacy seriously and do not store any personal data. Your uploaded images are used only for the AI analysis and are not stored on our servers."
    }
  ];

  return (
    <div className="bg-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold   text-center mb-8">
          Frequently Asked Questions
        </h1>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIStylerFAQ;