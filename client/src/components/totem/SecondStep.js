import StepTracker from './StepTracker';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SecondStep = () => {
  const navigate = useNavigate();
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    setQrValue(crypto.randomUUID());
  }, []);

  return (
    <div>
      <StepTracker currentStep={2} />
      <div className='flex flex-col items-center'>
        <h3>Perfect!</h3>
        <p>your table is: 12</p>
        <p>Scan the code below to make your orders</p>
        <QRCode
          id='qr-gen'
          value={qrValue}
          size={272}
          level={'H'}
          includeMargin={true}
        />
        <div className='flex gap-12'>
          <button
            className='bg-red-500 text-white'
            onClick={() => navigate('/firstStep')}>
            Go back
          </button>
          <button
            className='bg-green-500 text-white'
            onClick={() => navigate('/thirdStep')}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
