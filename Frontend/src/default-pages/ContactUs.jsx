import { default_page_images, default_page_icons } from "../assets/assets";

const calling_1 = "/gifs/calling_1.gif";
const mobile = "/gifs/mobile.gif";
const mail = "/gifs/mail.gif";
const office = "/gifs/office.gif";

const ContactUs = () => {
  return (
    <div>
      {/* TOP BANNER */}
      <div className="relative w-full min-h-[420px] md:min-h-[500px] lg:min-h-screen overflow-hidden">
        {/* SVG - Hidden on small screens */}
        <svg
          className="hidden md:block absolute top-0 left-0 w-full h-[600px] animate-svg-top"
          viewBox="0 0 1440 600"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            fill="url(#arcGradient)"
            d="M0,380 C360,590 1080,590 1440,380 L1440,0 L0,0 Z"
          />
          <defs>
            <linearGradient id="arcGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#008287" />
              <stop offset="100%" stopColor="#005B5F" />
            </linearGradient>
          </defs>
        </svg>

        {/* Clip Path Image */}
        <img
          src={default_page_images.clip_path_group}
          alt="Banner Clip"
          className="block absolute left-0 w-full h-auto animate-image-bottom"
          style={{
            top: "0",
            height: "auto",
            objectPosition: "center top",
            zIndex: 10,
          }}
        />

        {/* Homepage Image */}
        <div className="relative flex justify-center items-center h-full pt-6 sm:pt-8 md:pt-10 lg:pt-10 px-4 sm:px-6 md:px-8 z-20">
          <img
            src={calling_1}
            alt="calling"
            className="relative z-50 w-[140%] max-w-none sm:w-full sm:max-w-[780px] lg:max-w-[1350px] h-auto mt-8 md:mt-0 lg:-mt-[260px]"
          />
        </div>

        <h1 className="font-merriweather relative text-white font-bold text-xl sm:text-2xl md:text-5xl px-4 mt-6 md:-mt-[140px] text-center">
          Contact Us
        </h1>

        <p className="font-lato font-normal mt-6 text-center text-white sm:text-white md:text-gray-300 lg:text-black text-sm sm:text-[18px] px-4 pb-4">
          Have a question or need help? Reach out — we're here 24/7 to support
          your healthcare journey.
        </p>

        {/* Simple background for small screens */}
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[#008287] to-[#005B5F] -z-10"></div>
      </div>

      {/* CONTACT SECTIONS
          MOBILE: Card -> Image -> Card -> Image -> Card -> Image
          DESKTOP: Side-by-side, with Office swapped (Image left, Card right)
      */}
      <div className="px-4 sm:px-12 m-6 sm:m-20 lg:-mt-[110px] space-y-10">
        {/* 1) EMAIL */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-10">
          {/* Card */}
          <div
            className="order-1 md:order-1 bg-[linear-gradient(to_right,rgba(255,238,195,0.5)_0%,rgba(237,255,158,0)_100%)]
            rounded-[11px] w-full md:max-w-[520px] p-6 z-10"
          >
            <default_page_icons.MdOutlineMail size={40} className="mb-6" />

            <h1 className="font-merriweather font-bold text-[32px] mb-4">
              Email
            </h1>

            <p className="mb-4 text-sm md:text-base">
              Need help or have a question? Email us anytime:
            </p>

            <p className="underline cursor-pointer text-sm md:text-base">
              medih1811@gmail.com
            </p>
          </div>

          {/* Image */}
          <div className="order-2 md:order-2 relative w-full md:max-w-[520px] h-[320px] sm:h-[450px] flex justify-center items-center overflow-visible">
            <div className="hidden md:block absolute inset-0 -z-10">
              <div className="h-[400px] w-[400px] rounded-full bg-[#04585c] blur-[120px] opacity-60 mx-auto" />
            </div>

            <img
              src={mail}
              alt="mail"
              className="absolute w-[260%] sm:w-[220%] md:w-[280%] max-w-none object-contain"
            />
          </div>
        </div>

        {/* 2) OFFICE */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-10">
          {/* Card (first on mobile, right on desktop) */}
          <div
            className="order-1 md:order-2 bg-[linear-gradient(90deg,rgba(200,201,255,0.5)_0%,rgba(158,198,255,0)_100%)]
            rounded-[11px] w-full md:max-w-[520px] p-6 z-10"
          >
            <default_page_icons.CiLocationOn size={40} className="mb-4" />

            <h1 className="font-merriweather font-bold text-[32px] mb-4">
              Office
            </h1>

            <p className="mb-4 text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <p className="underline cursor-pointer text-sm md:text-base">
              123 Sample St, Sydney NSW 2000 AU
            </p>
          </div>

          {/* Image (second on mobile, left on desktop) */}
          <div className="order-2 md:order-1 relative w-full md:max-w-[520px] h-[320px] sm:h-[450px] flex justify-center items-center overflow-visible">
            <div className="hidden md:block absolute inset-0 -z-10">
              <div className="h-[400px] w-[400px] rounded-full bg-[#005B5F] blur-[120px] opacity-60 mx-auto" />
            </div>

            <img
              src={office}
              alt="office"
              className="absolute w-[260%] sm:w-[220%] md:w-[280%] max-w-none object-contain"
            />
          </div>
        </div>

        {/* 3) PHONE */}
        <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 sm:gap-10">
          {/* Card */}
          <div
            className="order-1 md:order-1 bg-[linear-gradient(to_right,rgba(255,238,195,0.5)_0%,rgba(237,255,158,0)_100%)]
            rounded-[11px] w-full md:max-w-[520px] p-6 z-10"
          >
            <default_page_icons.IoCallOutline size={40} className="mb-6" />

            <h1 className="font-merriweather font-bold text-[32px] mb-4">
              Phone
            </h1>

            <p className="mb-4 text-sm md:text-base">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>

            <p className="underline cursor-pointer text-sm md:text-base">
              +91 1234567890
            </p>
          </div>

          {/* Image */}
          <div className="order-2 md:order-2 relative w-full md:max-w-[520px] h-[320px] sm:h-[450px] flex justify-center items-center overflow-visible">
            <div className="hidden md:block absolute inset-0 -z-10">
              <div className="h-[400px] w-[400px] rounded-full bg-[#005B5F] blur-[120px] opacity-60 mx-auto" />
            </div>

            <img
              src={mobile}
              alt="mobile"
              className="absolute w-[260%] sm:w-[220%] md:w-[280%] max-w-none object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
