import { default_page_images } from "../assets/assets";

const Banner = ({ src, text = "", para = "" }) => {
  return (
    <div className="relative w-full min-h-[450px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] overflow-hidden">

      {/* SVG - Hidden on small screens */}
      <svg
        className="hidden md:block absolute top-0 left-0 w-full h-[600px] animate-svg-top"
        viewBox="0 0 1440 600"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          fill="url(#arcGradient)"
          d="M0,300 C360,550 1080,550 1440,300 L1440,0 L0,0 Z"
        />
        <defs>
          <linearGradient id="arcGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#008287" />
            <stop offset="100%" stopColor="#005B5F" />
          </linearGradient>
        </defs>
      </svg>

      {/* Clip Path Image - Hidden on small screens */}
      <img
        src={default_page_images.clip_path_group}
        alt="Banner Clip"
        className="hidden lg:block absolute left-0 w-full h-auto "
        style={{
          top: "0",
          height: "auto",
          objectPosition: "center top",
          zIndex: 10,
        }}
      />

      {/* Homepage Image */}
      <div className="relative flex justify-center items-center h-full pt-20 md:pt-20 lg:pt-10 px-4 sm:px-6 md:px-8">
        <img
          src={src}
          alt="homepage"
          className="relative z-20 w-full max-w-[400px] sm:max-w-[500px] md:max-w-[650px] lg:max-w-[1010px] h-auto sm:h-[300px] md:h-[400px] lg:h-[900px] object-contain mt-0 sm:-mt-10 md:-mt-25 lg:-mt-[170px] animate-image-bottom"
        />
      </div>

      {text && (
        <h1 className="absolute left-1/2 transform -translate-x-1/2 bottom-8 sm:bottom-12 md:bottom-16 lg:-translate-y-[20px] text-white font-semibold text-lg sm:text-2xl md:text-3xl px-4 text-center">
          {text}
        </h1>
      )}
      {para && (
        <p className="absolute left-1/2 transform -translate-x-1/2 bottom-2 sm:bottom-6 md:bottom-10 lg:static mt-3 sm:mt-5 md:mt-8 lg:mt-10 text-center text-white sm:text-white md:text-gray-300 lg:text-black font-normal text-sm sm:text-base px-4">
          {para}
        </p>
      )}

      {/* Simple background for small screens */}
      <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[#008287] to-[#005B5F] -z-10"></div>
    </div>
  );
};

export default Banner;
