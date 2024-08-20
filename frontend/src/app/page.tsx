import Link from 'next/link';
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <div>
      <div className="md:grid md:grid-cols-2 flex-column items-center justify-between pt-14 md:pt-1 min-h-screen ">
        <div className="flex flex-col py-10 items-center justify-between">
          <div className="mb-10 md:mb-0 text-center md:text-left ">
            <h1 className="text-4xl md:text-8xl font-bold" > DISCOVER YOUR PERFECT LOOK. </h1>
            <h1 className="text-4xl md:text-8xl font-bold" > with AI </h1>
            <h2 className='text-2xl px-3 py-1 mb:px-10 mb-5'> Scan. Style. Shop.</h2>
            <Link 
              href="/ai_stylist" 
              className="
                relative inline-block  m-5 text-white font-bold text-xl text-center no-underline
                bg-[#2563EB] px-3 py-3 mb:px-10 mb:py-3 rounded-md
                shadow-[inset_0_1px_0_#FFE5C4,_0_10px_0_#1E3A8A]
                active:top-[10px] active:bg-[#2563EB]
                active:shadow-[inset_0_1px_0_#BAE6FD,_inset_0_-3px_0_#1E3A8A]
                transition-all duration-100 ease-in-out
                before:content-[''] before:absolute before:bottom-[-15px] before:left-[-4px]
                before:w-[calc(100%+8px)] before:h-[calc(100%+8px)] before:bg-[#2B1800]
                before:rounded-md before:-z-10
              "
              style={{
                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                textShadow: '0px 1px 0px #000',
                filter: 'dropshadow(color=#000, offx=0px, offy=1px)'
              }}
            >
              Try AI Stylist Free
            </Link>
          </div>
        </div>
        <div>
            <Image
              src="/clothrack.jpg"
              alt="Style Match Concept"
              width={800}
              height={1000}
              className="rounded-lg"
            />
          </div>
      </div>
      <div className="flex-column items-center pt-5 justify-between min-h-screen ">
        <h2 className='mb-5 mt-7 text-2xl md:text-7xl text-center pr-5'> Revolutionize your shopping experience with our AI-powered fashion assistant. </h2>
        {/* Upload a dressing room selfie, and instantly receive personalized recommendations for perfectly coordinated outfits. Say goodbye to endless browsing and indecision - our smart technology ensures you look stylish effortlessly, saving you time and money. Transform your wardrobe with just a click.             */}
      </div>
    </div>
  );
};

export default HomePage;

// https://lovi.care/?ref=godly