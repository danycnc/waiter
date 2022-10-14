import { useState } from 'react';
import StepTracker from './StepTracker';
import { useNavigate } from 'react-router-dom';

const FirstStep = () => {
  const navigate = useNavigate();
  const [pax, setPax] = useState(2);

  const handlePax = (operation) => {
    if (operation === '+' && pax < 12) {
      setPax(pax + 1);
    } else {
      operation === '-' && pax > 1 && setPax(pax - 1);
    }
  };

  return (
    <div>
      <StepTracker currentStep={1} />
      <div className='flex flex-col items-center gap-32'>
        <h2 className='text-3xl'>How many people are you?</h2>
        <div className='flex gap-5'>
          <button
            className='bg-slate-300 px-6 py-3 box-border w-24 rounded-full text-2xl'
            onClick={() => handlePax('-')}>
            -
          </button>
          <input
            className='bg-slate-400 w-16 text-center text-4xl rounded-md'
            readOnly={true}
            name='people'
            value={pax}
          />
          <button
            className='bg-slate-300 px-6 py-3 box-border w-24 rounded-full text-2xl'
            onClick={() => handlePax('+')}>
            +
          </button>
        </div>
        <div className='flex gap-12'>
          <button
            className='bg-red-500 text-white'
            onClick={() => navigate('/')}>
            <i className='fa-solid fa-chevron-left text-sm pr-2' />
            Go back
          </button>
          <button
            className='bg-green-500 text-white'
            onClick={() => navigate('/secondStep')}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default FirstStep;
