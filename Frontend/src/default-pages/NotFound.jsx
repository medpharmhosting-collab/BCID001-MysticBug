import { images } from "../assets/assets";

const NotFound = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-white">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-[700px] object-cover"
      >
        <source src={images.page404} type="video/mp4" />
      </video>
    </div>
  );
};

export default NotFound;