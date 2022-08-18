import { useNavigate } from 'react-router-dom';
import laptop_qr from '../assets/qr-code-laptop.png';

const Totem = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col m-auto items-center'>
      <h1 className='text-6xl mb-48'>Welcome</h1>
      <h3 className='text-3xl'>Scan code to start</h3>
      <img src={laptop_qr} alt='qr-code' width={256} />
      <button onClick={() => navigate('/firstStep')}>Done!</button>
    </div>
  );
};

export default Totem;
