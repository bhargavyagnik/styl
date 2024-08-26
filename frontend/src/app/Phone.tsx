"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

const timetoshow = 0;
const Phone: React.FC = () => {
  const [showScanline, setShowScanline] = useState(true);
  const [showProducts, setShowProducs] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScanline(true);
    }, timetoshow); // Hide scanline after 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        setShowProducs(true);
    }, timetoshow); // Hide scanline after 3 seconds

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);

  return (
    <div>
        <div className="relative flex justify-center">
            <div className="callout-box callout-upload">
                <strong>Upload</strong><br/>
                Your Image
            </div>
            <div className="callout-box callout-aiscan">
                <strong>AI Scan</strong><br/>
                Picks best styles from H&M, Zara, etc.*
            </div>
            <div className="callout-box callout-output">
                <strong>Instant </strong><br/>
                Suggestions
            </div>
            <Image
                src="/phone.png"
                alt="iPhone Frame"
                width={800}
                height={1000}
                className="rounded-lg z-5"
            />
            <div className="absolute top-[14%] left-[31%] w-[38.5%] h-[77.5%] overflow-hidden rounded-[2%]">
            {/* {showScanline && <h2 className="text-2xl font-semibold text-black left-[2.5%] w-[95%] text-center mb-10 z-2">  Upload Image</h2>} */}
            <div className="absolute left-[2.5%] w-[95%] h-[50%] overflow-hidden rounded-[2%]">
            {showScanline && <div className="scan-line"></div>}
            <Image
                src="/download.webp"
                alt="Pant Image"
                width={600}
                height={800}
            />
            </div>
            {showProducts &&
            <div className="absolute top-[50%] left-[2.5%] w-[95%] h-[50%] overflow-hidden">
            <h2 className="text-xs md:text-sm font-semibold mb-4">
                Suggested Outfits
            </h2>
            <div className="left-[2.5%] w-[98%] h-[75%] overflow-hidden">
                <div className="absolute flex w-[150%] animate-scroll">
                <img
                    src="ss1.png"
                    alt="Image 1"
                    className="w-1/3 h-full object-cover m-2"
                />
                <img
                    src="ss2.png"
                    alt="Image 2"
                    className="w-1/3 h-full object-cover m-2"
                />
                <img
                    src="ss3.png"
                    alt="Image 3"
                    className="w-1/3 h-full object-cover m-2"
                />
            
                <img
                    src="ss1.png"
                    alt="Image 1"
                    className="w-1/3 h-full object-cover m-2"
                />
                <img
                    src="ss2.png"
                    alt="Image 2"
                    className="w-1/3 h-full object-cover m-2"
                />
                <img
                    src="ss3.png"
                    alt="Image 3"
                    className="w-1/3 h-full object-cover m-2"
                />
                </div>
            </div>
            </div>}
        </div>
        </div>
    <p className="text-grey font-thin text-[10px] text-center"> * Currently search is limited to H&M, Zara, Aritizia, Lululemon, and Uniqlo. Contact us to add your favourite brands. </p>
    </div>
  );
};

export default Phone;
