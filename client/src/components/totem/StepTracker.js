const StepTracker = ({ currentStep = 0 }) => {
  const inactive = 'px-[15px] py-[5px] my-2 rounded-full border-2';
  const active = `${inactive} bg-yellow-400`;

  return (
    <div className='flex justify-center gap-32 mb-40'>
      <span id='first' className={(currentStep === 1 && active) || inactive}>
        1
      </span>
      <span id='second' className={(currentStep === 2 && active) || inactive}>
        2
      </span>
      <span id='third' className={(currentStep === 3 && active) || inactive}>
        3
      </span>
    </div>
  );
};

export default StepTracker;
