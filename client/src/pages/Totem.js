import { useNavigate } from 'react-router-dom';

const Totem = () => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col m-auto items-center'>
      <h1 className='text-6xl mb-48'>Welcome</h1>
      <h2 className='text-3xl'>Scan code to start</h2>
      {/* <img src={laptop_qr} alt='qr-code' width={256} /> */}
      <button onClick={() => navigate('/firstStep')}>Done!</button>
    </div>
  );
};

export default Totem;
