import StepTracker from './StepTracker';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TablesMap from './TablesMap';
import { useDispatch } from 'react-redux';
import { tableIDSlicer } from '../../slicers/tableIDSlicer';

const SecondStep = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tableID, setTableID] = useState(null);

  const reserve = () => {
    fetch(`http://192.168.1.119:3000/reserve/${tableID}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch(tableIDSlicer.actions.populate(data));
      })
      .catch((error) => {
        console.error('Error:', error.message);
      });
  };

  return (
    <div>
      <StepTracker currentStep={2} />
      <div className='flex flex-col items-center gap-10'>
        <h2>Choose a table</h2>

        <TablesMap setTableID={setTableID} />
        <div className='flex gap-12'>
          <button
            className='bg-red-500 text-white'
            onClick={() => navigate('/firstStep')}>
            <i className='fa-solid fa-chevron-left text-sm pr-2' />
            Go back
          </button>
          <button
            className='bg-green-500 text-white'
            disabled={!tableID}
            onClick={() => {
              reserve();
              navigate('/thirdStep');
            }}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecondStep;
