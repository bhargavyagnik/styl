"use client"
import React, { useState, useEffect } from "react";
import Image from "next/image";

const timetoshow = 0;
const ANIMATION_DURATION = 12000;

const Phone: React.FC = () => {
    const [activeCallout, setActiveCallout] = useState<number | null>(null);
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

    useEffect(() => {
    const animateCallouts = () => {
        setActiveCallout(1);
        setTimeout(() => setActiveCallout(2), ANIMATION_DURATION / 3);
        setTimeout(() => setActiveCallout(3), (ANIMATION_DURATION / 3) * 2);
    };

    animateCallouts();
    const interval = setInterval(animateCallouts, ANIMATION_DURATION);

    return () => clearInterval(interval);
    }, []);

    const getCalloutStyle = (calloutNumber: number) => ({
    opacity: activeCallout === calloutNumber ? 1 : 0,
    transition: 'opacity 0.5s ease-in-out',
    });

    const getUploadCalloutStyle = () => ({
        opacity: activeCallout ===1 || activeCallout === 2 || activeCallout===3 ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        });

  return (
    <div>
        <div className="relative flex justify-center">
            <div className="callout-box callout-upload" style={getCalloutStyle(1)}>
            <strong className="text-orange-300">Upload Image</strong><br/>
            and choose accessory
            </div>
            <div className="callout-box callout-aiscan" style={getCalloutStyle(2)}>
            <strong className="text-amber-700">AI Scan</strong><br/>
            Picks best styles from H&M, Zara, etc.*
            </div>
            <div className="callout-box callout-output" style={getCalloutStyle(3)}>
            <strong className="text-yellow-700">Instant <br/> Suggestions</strong>
            </div>
            {/* <div className="line line-upload" style={getCalloutStyle(1)}></div>
            <div className="line line-aiscan" style={getCalloutStyle(2)}></div>
            <div className="line line-output" style={getCalloutStyle(3)}></div> */}
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
                <div className="scan-line" style={getCalloutStyle(2)}></div>
                <Image
                    src="/download.webp"
                    alt="Pant Image"
                    width={600}
                    height={800}
                    style={getUploadCalloutStyle()}
                />
            </div>
            <div className="absolute top-[50%] left-[2.5%] w-[95%] h-[50%] overflow-hidden" style={getCalloutStyle(1)}>
                <select className="block w-full p-2 border border-gray-300 rounded-md text-[0.65rem]/[1]">
                <option value="Footwear">Footwear</option>
                </select>
            </div>
            {showProducts &&
            <div className="absolute top-[50%] left-[2.5%] w-[95%] h-[50%] overflow-hidden" style={getCalloutStyle(3)}>
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
