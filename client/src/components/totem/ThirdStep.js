import StepTracker from './StepTracker';
import QRCode from 'qrcode.react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { tableIDSlicer } from '../../slicers/tableIDSlicer';

const ThirdStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tableData = useSelector((state) => state.tableIDSlicer);

  const [qrValue, setQrValue] = useState('');

  const unreserve = () => {
    fetch(`http://192.168.1.119:3000/unreserve/${tableData.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(tableIDSlicer.actions.reset());
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  useEffect(() => {
    setQrValue(tableData.sessionID);
  }, [tableData]);
  return (
    <div>
      <StepTracker currentStep={3} />
      <div className='flex flex-col items-center gap-5'>
        <h2>
          Table n.<strong>{tableData.id}</strong> reserved!
        </h2>

        <h3>This is your QR code table, scan it with phone to login: </h3>
        <QRCode
          id='qr-gen'
          // value={`http://192.168.1.119:3001/home/${tableData.id}/${qrValue}`}
          value={`http://192.168.1.119:3001/home/${tableData.id}/${qrValue}`}
          size={272}
          level={'H'}
          includeMargin={true}
        />
        <div className='flex gap-12'>
          <button
            className='bg-red-500 text-white'
            onClick={() => {
              unreserve();
              navigate('/firstStep');
            }}>
            Delete reservation
          </button>
          <button
            className='bg-green-500 text-white'
            onClick={() => navigate('/')}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThirdStep;
