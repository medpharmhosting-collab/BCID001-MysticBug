import { images } from '../../assets/assets.js'
const Loader = () => {
  return (
    <div className="flex justify-center">
      <div className="animate-spin">
        <img src={images.loadinganim} alt="loading" className='h-14 w-14' />
      </div>
    </div>
  );
};

export default Loader;
