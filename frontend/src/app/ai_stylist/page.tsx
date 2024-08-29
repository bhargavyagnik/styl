"use client";
import React, { useState, useRef,useEffect } from 'react';
import axios from 'axios';

interface OutfitItem {
  item: string;
  page_url: string;
  image_url: string;
}

interface LocationData {
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
}

interface ErrorResponse {
  error: string;
}


declare global {
  interface Window {
    gtag: (
      type: string,
      action: string,
      params: { event_category: string; event_label: string }
    ) => void;
  }
}
const TryOutfitPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outfitItems, setOutfitItems] = useState<OutfitItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [gender, setGender] = useState<string>('any');
  const [styleType, setStyleType] = useState<string>('any');
  const [accessory, setAccessory] = useState<string>('any');
  const suggestedOutfitsRef = useRef<HTMLDivElement|null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [geminiResponse, setGeminiResponse] = useState<string[]>([]);

  useEffect(() => {
    if (outfitItems.length > 0 && suggestedOutfitsRef.current) {
      suggestedOutfitsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [outfitItems]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
      setError(null);
      setOutfitItems([]);
      setGeminiResponse([]);
    }
  };

  const trackEvent = (action: string, label: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: 'Outfit Search',
        event_label: label,
      });
    }
  };
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      if (!file) {
        setError('Please select a file to upload.');
        return;
      }
  
      // Track the search event
      trackEvent('search', `${gender}-${styleType}-${accessory}`);
      let country: string | null = null;
      try {
        // First, get the user's location
        const locationResponse = await axios.get<LocationData | ErrorResponse>('/api/get-ip-location');
        
        if ('error' in locationResponse.data) {
          console.warn('Error fetching location:', locationResponse.data.error);
        } else {
          country = locationResponse.data.country;
        }
      }
      catch (error) {
        console.warn('Error fetching location:', error);
      }
      const formData = new FormData();
      formData.append('file', file);
      formData.append('gender', gender);
      formData.append('styleType', styleType);
      formData.append('accessory', accessory);
      if (country) {
        formData.append('location',country);
      }
      formData.append('brand',"zara");
      
      setIsScanning(true);
      setIsLoading(true);
  
      try {
        // const response = await axios.post('/fastapi/process-image', formData, {
        const response = await axios.post('http://localhost:8000/process-image', formData, {
          headers: {
            method: 'POST',
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setOutfitItems(response.data.suggested_items);
        setGeminiResponse(response.data.gemini_response);
        setError(null);
        
        if (suggestedOutfitsRef.current){
          suggestedOutfitsRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Track successful search
        trackEvent('search_success', `${gender}-${styleType}-${accessory}`);
      } catch (error) {
        setError('An error occurred while processing the image.');
        setOutfitItems([]);
        
        // Track search error
        trackEvent('search_error', `${gender}-${styleType}-${accessory}`);
      } finally {
        setIsLoading(false);
        setIsScanning(false);
      }
    };

  return (
    <div className="max-w-4xl mx-auto mt-5 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">Upload an Image to Get Outfit Suggestions</h2>
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex items-center justify-center w-full mb-4">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-2 h-2 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">PNG, JPG, GIF or Webp</p>

            </div>
            <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept="image/*" capture/>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Gender</option>
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="unisex">Unisex</option>
          </select>
          <select
            value={styleType}
            onChange={(e) => setStyleType(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Style Type</option>
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
            <option value="sporty">Sporty</option>
          </select>
          <select
            value={accessory}
            onChange={(e) => setAccessory(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="any">Clothing/ Accessory </option>
            <option value="Tshirt">Tshirt</option>
            <option value="Pants/">Pants</option>
            <option value="Footwear">Footwear</option>
            <option value="Sunglasses">Sunglasses</option>
          </select>
        </div>
        <button type="submit" className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300" disabled={isLoading}>
          {isLoading ? 'searching...' : 'Get Outfit Suggestions'}
        </button>
      </form>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {previewUrl && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Selected Image:</h2>
          <div className="relative inline-block overflow-hidden">
            <img src={previewUrl} alt="Selected" className="max-w-full h-auto rounded-lg shadow-md"/>
            {isScanning && (
              <div className="scan-line"></div>
            )}
          </div>
        </div>
      )}
      {geminiResponse.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">AI Stylist Suggestions</h2>
          <p className="text-gray-700 mb-2">Based on the image you uploaded, our AI Stylist suggests the following:</p>
          <ul className="list-disc pl-5">
            {geminiResponse.map((item, index) => (
              <li key={index} className="text-gray-700 mb-2">{item}</li>
            ))}
          </ul>
        </div>
      )}
      {outfitItems.length > 0 && (
        <div ref={suggestedOutfitsRef}>
          <h2 className="text-2xl font-semibold mt-4 mb-4">Suggested Outfit Links</h2>
          <p className="text-grey font-thin text-[10px] text-center mb-3 "> * Currently search is limited to specific brands. Contact us to add your favourite brands. </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {outfitItems.map((item, index) => (
              <div key={index} className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                <a href={item.page_url} target="_blank" rel="noopener noreferrer" className="block">
                  <img src={item.image_url} alt={item.item} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-900">{item.item}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
  );
};

export default TryOutfitPage;