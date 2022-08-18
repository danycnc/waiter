import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Scanner from '../components/Scanner';
import successICO from '../assets/success.png';

const Login = () => {
  const [enableScanner, setEnableScanner] = useState(false);
  const scannedQR = useSelector((state) => state.scannedQR);
  const [showSuccess, setShowSuccess] = useState(false);

  const checkScannedValue = () => {
    console.log(enableScanner);
    if (scannedQR) setEnableScanner(false);
  };

  useEffect(() => {
    scannedQR && setShowSuccess(true);
  }, [scannedQR]);

  return (
    <div>
      <div className='mb-28'>
        <h1>Registration</h1>
      </div>
      <div className='flex flex-col items-center gap-10'>
        <input
          className='w-2/3 text-center text-xl'
          onChange={checkScannedValue}
          type='password'
          value={scannedQR}
          readOnly={true}
        />
        <button onClick={() => setEnableScanner(true)}>
          Scan table QRCode
        </button>
        {enableScanner && <Scanner />}
        {showSuccess && (
          <div>
            <img src={successICO} alt='Success' width={96} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
