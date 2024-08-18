import Link from 'next/link';
import Image from 'next/image';

const HomePage: React.FC = () => {
  return (
    <div className="md:grid md:grid-cols-2 flex-column items-center justify-between min-h-screen">
      <div className="flex flex-col py-10 items-center justify-between">
        <div className="mb-10 md:mb-0 text-left ">
          <h1 className="text-4xl md:text-8xl font-bold" > DISCOVER YOUR PERFECT LOOK. </h1>
          <h1 className="text-4xl md:text-8xl font-bold" > with AI </h1>
          <h2 className='text-2xl mb-5'> Scan. Style. Shop.</h2>
          <Link href="/ai_stylist" className="bg-blue-600 text-white px-2 py-2 mb:px-10 mb:py-3 text-lg font-semibold hover:bg-blue-700 transition duration-300">
            Try AI Stylist
          </Link>
          <p className='mb-5 mt-7 pr-5'> Convert Dressing room selfies to purchasing decision. With our AI based search, upload a pic and choose what apparel / assessory are you looking for, based on the style and we will recommend you the perfect color co-ordinated pair.</p>
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
  );
};

export default HomePage;