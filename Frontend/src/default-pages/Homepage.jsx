import Banner from '../components/Banner'
import { default_page_images } from '../assets/assets'
import { default_page_icons } from "../assets/assets"
import { useEffect, useState } from 'react'

const calling_girl = '/gifs/calling_girl.gif';
const repair_man = '/gifs/repair_man.gif';
const homehealth = '/gifs/homehealth.gif';
const sirenwtext = '/gifs/sirenwtext.gif';
const Homepage = () => {
  const diseasesData = [
    {
      id: 1,
      banner: default_page_images.DiseaseBanner01,
      title: "SARS Emerges in China",
      year: "2002-2003",
      description:
        "The Severe Acute Respiratory Syndrome (SARS) coronavirus, part of a family of viruses that commonly cause respiratory symptoms such as coughing and shortness of breath, is first identified in late 2002 in southern China. SARS spreads to more than two dozen countries across four continents, infecting more than eight thousand people. Close to eight hundred, most within China and Hong Kong, by the time the outbreak is quelled in mid-2003. The virus is thought to have been transmitted to humans via contact with civet cats.",
    },
    {
      id: 2,
      banner: default_page_images.DiseaseBanner02,
      title: "First Cholera Pandemic",
      year: "1817-1947",
      description:
        "Seven cholera pandemics have occured since 1817, but there global death are unclear Between 1865 & 1947 at least 23 million people died from cholera in india alone",
    },
    {
      id: 3,
      banner: default_page_images.DiseaseBanner03,
      title: "Flu Pandemic",
      year: "1830-1833",
      description:
        "The first pandemic that can be confidently attributed to the flu occured in 1580 Between 10-26 flu, pandemic have occured since the",
    },
    {
      id: 4,
      banner: default_page_images.DiseaseBanner04,
      title: "Russian flu",
      year: "1889",
      description:
        "4 million estimated deaths",
    },
    {
      id: 5,
      banner: default_page_images.DiseaseBanner05,
      title: "Spanish flu Pandemic",
      year: "1918-1920",
      description:
        "50-100 million deaths",
    },
    {
      id: 6,
      banner: default_page_images.DiseaseBanner06,
      title: "Penicillin Ushers in Antibiotics Era",
      year: "1928",
      description:
        "Scottish scientist Alexander Fleming discovers penicillin, the first antibiotic—a class of drugs used to treat bacterial infections—marking a major milestone for global health. Widespread use of antibiotics takes off in the early 1940s during World War II.",
    },
    {
      id: 7,
      banner: default_page_images.DiseaseBanner07,
      title: "Asian Flu Pandemic",
      year: "1957-1958",
      description:
        "A new strain of influenza virus, designated H2N2, is reported in Singapore in February 1957, and soon spreads to China, Hong Kong, the United Kingdom (UK), and the United States. Though less severe than the Spanish Flu, the Asian Flu kills more than one million people worldwide.",
    },
    {
      id: 8,
      banner: default_page_images.DiseaseBanner08,
      title: "Hong Kong Flu",
      year: "1968-1969",
      description:
        ": A decade after the Asian Flu, a new strain called H3N2 emerges. Commonly called the Hong Kong Flu, it emerges first in Hong Kong, then a British colony, in July 1968.",
    },
    {
      id: 9,
      banner: default_page_images.DiseaseBanner09,
      title: "Smallpox",
      year: "1977-1980",
      description:
        "The last known case of smallpox, a viral disease that plagued humans for millennia, is diagnosed in 1977 in Somalia, following a nearly two-decade-long global vaccination campaign. Three years later the WHO formally declares it eradicated around the globe.",
    },
    {
      id: 10,
      banner: default_page_images.DiseaseBanner01,
      title: "HIV/ AIDS pandemic",
      year: "1981-2025",
      description:
        "A 1981 report by what is now the U.S. Centers for Disease Control and Prevention (CDC) describes a rare form of pneumonia that is later identified as Acquired Immunodeficiency Syndrome, or AIDS. It is the most advanced stage of Human Immunodeficiency Virus (HIV).",
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);

  const PAUSE_TIME = 3000;


  useEffect(() => {
    setPrevIndex(currentIndex);
  }, [currentIndex]);


  const slideWidth = 100 / diseasesData.length;
  const percentDistance = Math.abs(currentIndex - prevIndex) * slideWidth;
  const SPEED = 20;
  const duration = Math.max(700, (percentDistance / SPEED) * 4000);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === diseasesData.length - 1 ? 0 : prev + 1
      );
    }, duration + PAUSE_TIME);

    return () => clearTimeout(timeout);
  }, [currentIndex, duration, diseasesData.length]);

  const handleSupportCall = () => {
    window.location.href = "tel:number"
  }
  return (
    <div>
      <Banner src={default_page_images.homepage} />
      <div className="px-2 sm:px-12 py-4 sm:py-4 lg:-mt-[110px]">
        <div
          className="bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] flex flex-col lg:flex-row justify-between items-start px-4 py-3 sm:px-8 sm:py-6">

          {/* Left */}
          <div className="flex-1 pr-0 lg:pr-6">
            <div className="flex gap-2 font-lato font-semibold text-[16px] tracking-wide text-[#07353D] mb-2 flex-wrap">
              <span className="flex items-center gap-1">
                Health <default_page_icons.FaLeaf size={14} />
              </span>
              <span className="flex items-center gap-1">
                Care <default_page_icons.FaLeaf size={14} />
              </span>
              <span className="flex items-center gap-1">
                Peace <default_page_icons.FaLeaf size={14} />
              </span>
              <span className="flex items-center gap-1">
                Simplicity
              </span>
            </div>

            <h1
              className="font-merriweather font-normal text-[#0B0B0B] text-[44px] sm:text-[56px] leading-[1.05]"
            >
              Effortless Healthcare,<br />Anytime.
            </h1>
          </div>

          {/* Right */}
          <div className="flex-1 max-w-[560px] pt-4">
            <p className="font-lato text-[16px] sm:text-[17px] text-[#1F2937]  leading-[1.85] "
            >
              Designed for simplicity. Built for life. MediH makes healthcare effortless —
              from emergency support to everyday checkups. With AI-powered guidance,
              secure access to records, and 24/7 virtual care, we're here to bring peace of
              mind to every moment that matters.
            </p>
          </div>
        </div>
      </div>

      {/* medical emergency section */}
      <div id='emergency' className="px-4 sm:px-12 py-10 sm:py-8 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

        {/* Left Section - Text Content */}
        <div className='flex-1 w-full min-w-0 px-4 py-3 sm:px-8 sm:py-6 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] rounded-[25px]'>
          <h1 className='font-merriweather font-normal text-[#0B0B0B] text-[44px] sm:text-[56px] leading-[1.05] mb-4'>
            Emergency Help, When Every Second Counts.
          </h1>
          <p className='font-normal text-18 font-lato text-[#0B0103]'>
            When every second matters, MediH's Panic Button gives you immediate access to emergency support.
            With a single tap, our system alerts nearby healthcare professionals, activates ambulance services,
            and guides you through essential first steps — ensuring help reaches you as fast as possible.
          </p>
        </div>


        {/* Right Section - Emergency Button */}
        <div className="flex-1 flex justify-center items-center relative min-h-[300px] sm:min-h-[400px]">
          <div className="relative">
            {/* Emergency Button */}
            <div className="relative bg-white p-2">
              <img
                onClick={handleSupportCall}
                src={sirenwtext}
                alt="Emergency red light"
              />
            </div>
          </div>
        </div>

      </div>
      {/* know more section */}
      <div className="relative px-4 sm:px-12 py-6 sm:py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="font-merriweather font-normal text-4xl sm:text-56 leading-tight md:leading-[120%] tracking-[-0.5px]">
            Know More, Worry Less.
          </h1>

          <div className="flex flex-wrap justify-center gap-3 md:gap-4 font-lato font-semibold">
            <p className=" text-[#07353D] flex items-center gap-2">
              Health <default_page_icons.FaLeaf className="text-[#07353D]" size={14} />
            </p>
            <p className=" text-[#07353D] flex items-center gap-2">
              Care <default_page_icons.FaLeaf className="text-[#07353D]" size={14} />
            </p>
            <p className=" text-[#07353D] flex items-center gap-2">
              Peace <default_page_icons.FaLeaf className="text-[#07353D]" size={14} />
            </p>
            <p className=" text-[#07353D] flex items-center gap-2">
              Simplicity
            </p>
          </div>

          <p className="font-semibold text-base leading-[150%] max-w-5xl px-2 md:px-0">
            Learn about common conditions, their symptoms, and how to handle them —
            from heart attacks to fevers, all in one place.
          </p>
        </div>

        <div className="relative h-full sm:min-h-screen">
          {/* Blurry Effects (behind everything, hidden on mobile) */}
          <div className="absolute inset-0 pointer-events-none z-0 hidden sm:block">
            <div className="absolute top-[-65px] left-[-70px] h-72 w-72 rounded-full bg-[#005B5F] blur-3xl opacity-70" />
            <div className="absolute bottom-[45px] right-[-70px] h-72 w-72 rounded-full bg-[#005B5F] blur-3xl opacity-70" />
          </div>

          {/* Carousel Container */}
          <div className="relative w-full h-[300px] sm:h-[400px] md:h-[590px] mx-auto mt-6 rounded-lg overflow-hidden z-10 bg-white/60 backdrop-blur-sm shadow-lg">
            {/* Sliding Cards Container */}
            <div
              className="flex h-full transition-transform ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * slideWidth}%)`,
                width: `${diseasesData.length * 100}%`,
                transitionDuration: `${duration}ms`
              }}
            >
              {diseasesData.map((disease, index) => (
                <div
                  key={disease.id}
                  className="relative h-full flex-shrink-0"
                  style={{ width: `calc(100% / ${diseasesData.length})` }}
                >
                  {/* Background Image */}
                  <img
                    src={disease.banner}
                    alt={disease.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                  />

                  {/* Content */}
                  <div className="relative z-20 flex flex-col justify-center h-full px-4 sm:px-8 md:px-12 py-6 sm:py-8 md:py-10 text-black">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-medium mb-1">
                      {disease.title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-md mb-3 sm:mb-4 text-gray-800">
                      {disease.year}
                    </p>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6 md:mb-8">
                      {disease.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* healthcare needs section */}
      <div className="px-4 sm:px-12 lg:-mt-[110px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between items-start sm:gap-8 ">

          {/* Image with Blur */}
          <div className="relative flex-shrink-0 flex-1 flex items-center">
            {/* Blurry Ball */}
            <div className="absolute top-10 left-0 h-60 w-60 rounded-full bg-[#005B5F] blur-3xl opacity-70 z-0" />

            {/* Image */}
            <img
              src={homehealth}
              alt="Healthcare Illustration"
              className="relative block mx-auto w-[500px] sm:w-[600px] h-[300px] sm:h-[500px] z-10"
            />
          </div>

          {/* Text & Features */}
          <div className="w-full max-w-[632px]">
            <h2 className="font-merriweather font-normal text-4xl sm:text-48 leading-snug sm:leading-[1.3] md:leading-[1.2] tracking-[-0.01em]">
              Always Here for Your Healthcare Needs
            </h2>
            <p className="font-lato font-normal text-18 leading-[1.4] sm:leading-[1.5] tracking-normal mt-4">
              Our 24/7 AI chatbot is designed to assist you anytime, anywhere. Experience seamless interaction for your healthcare inquiries.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mt-6">
              <div className='p-4 bg-gradient-to-r from-[rgba(200,201,255,0.5)] to-[rgba(158,198,255,0)] rounded-[25px]'>
                <default_page_icons.FaRegClock className='w-6 h-6 mb-2' />
                <h2 className='font-merriweather font-regular text-20 leading-[1.4] tracking-[-0.01em]'>24/7 AI Chatbot</h2>
                <p>Instant health guidance, anytime you need it.</p>
              </div>
              <div className='p-4 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] rounded-[25px]'>
                <default_page_icons.FaHandHoldingHeart className='w-6 h-6 mb-2' />
                <h2 className='font-merriweather font-regular text-20 leading-[1.4] tracking-[-0.01em]'>Real-Time Family Updates</h2>
                <p>Stay informed about your loved ones' care.</p>
              </div>
              <div className='p-4 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] rounded-[25px]'>
                <default_page_icons.RiChatCheckLine className='w-6 h-6 mb-2' />
                <h2 className='font-merriweather font-regular text-20 leading-[1.4] tracking-[-0.01em]'>Instant Appointment Booking</h2>
                <p>Book virtual or in-person visits in seconds</p>
              </div>
              <div className='p-4 bg-gradient-to-r from-[rgba(200,201,255,0.5)] to-[rgba(158,198,255,0)] rounded-[25px]'>
                <default_page_icons.LuTablet className='w-6 h-6 mb-2' />
                <h2 className='font-merriweather font-regular text-20 leading-[1.4] tracking-[-0.01em]'>Telemedicine</h2>
                <p>Consult top doctors without leaving home</p>
              </div>
              <div className='p-4 bg-gradient-to-r from-[rgba(200,201,255,0.5)] to-[rgba(158,198,255,0)] rounded-[25px]'>
                <default_page_icons.BiBook className='w-6 h-6 mb-2' />
                <h2 className='font-merriweather font-regular text-20 leading-[1.4] tracking-[-0.01em]'>Medical Record Access</h2>
                <p>All your health records, securely in one place.</p>
              </div>
              <div className='p-4 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] rounded-[25px]'>
                <default_page_icons.FiHome className='w-6 h-6 mb-2' />
                <h2 className='font-merriweather font-regular text-20 leading-[1.4] tracking-[-0.01em]'>Medicine Delivery</h2>
                <p>Get prescribed medicines delivered to your door.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br /><br />

      {/* instant help section */}
      <div className="relative w-full min-h-[800px] sm:min-h-[1000px] overflow-hidden rounded-2xl">

        <div
          className="absolute top-8 sm:top-2 left-4 sm:left-8
               max-w-[320px] sm:max-w-[785px] p-4 sm:p-6
              bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)] rounded-[25px] z-20"
        >
          <h1 className="font-merriweather text-[30px] sm:text-[40px] lg:text-[56px] leading-none font-normal mb-3 sm:mb-4 text-[#0B0B0B]">
            Instant Help,<br />One Tap Away.
          </h1>
          <p className="font-lato text-[12px] sm:text-[14px] lg:text-[16px] text-[#1F2937] leading-relaxed">
            Emergencies don't wait — and neither should you. With MediH's Panic Button,
            immediate assistance is just a tap away. Whether it's a sudden health scare,
            an accident, or a loved one in distress, our system alerts nearby medical
            professionals, dispatches ambulance services by land, water, or air, and
            provides you with essential first-aid instructions while help is on the way.
            It's peace of mind in your pocket, designed to act when you can't.
          </p>
        </div>

        <img
          src={default_page_images.clip_path_group}
          alt="wave pattern background"
          className="absolute left-1/2 top-1/2
              -translate-x-1/2 -translate-y-1/2
              w-full h-auto
              z-0 opacity-90"
        />
        <div className="hidden sm:block absolute top-10 right-0 h-60 w-60 rounded-full bg-[#005B5F] blur-3xl opacity-70 z-0" />
        <img
          src={calling_girl}
          alt="Woman calling for emergency help"
          className="absolute right-[-50px] sm:right-[-150px]
          top-[250px] sm:top-[-190px]
          w-[200px] h-[200px] sm:w-[1000px] sm:h-[700px] z-15"
        />

        <img
          src={repair_man}
          alt="AI health assistant bot"
          className="absolute left-[-20px] sm:left-[-90px]
          bottom-[300px] sm:bottom-[20px]
          w-[200px] h-[200px] sm:w-[1000px] sm:h-[700px] z-15"
        />

        <div
          className="absolute bottom-8 sm:bottom-12 right-0 sm:right-8
               max-w-[320px] sm:max-w-[538px] p-4 sm:p-6 bg-gradient-to-r from-[rgba(255,238,195,0.5)] to-[rgba(237,255,158,0)] rounded-[25px] z-20"
        >
          <h1 className="font-merriweather text-[30px] sm:text-[40px] lg:text-[56px] leading-none mb-3 sm:mb-4 text-[#0B0B0B]">
            Your 24/7 Health<br />Companion.
          </h1>
          <p className="font-lato text-[12px] sm:text-[14px] lg:text-[16px] text-[#1F2937] leading-relaxed">
            Got symptoms at 2AM? Confused about what to do next? Meet MediH's AI-powered
            chatbot — your always-on, always-ready health assistant. It listens to your
            concerns, helps you understand what might be wrong, suggests safe next steps,
            and connects you to doctors in real-time for virtual or in-person
            consultations. No more Googling symptoms. No more waiting on hold. Just
            simple, smart, accessible care — whenever you need it.
          </p>
        </div>

      </div>


    </div>
  )
}

export default Homepage
