const Modal = ({ children, title, onClose, button }) => {
  return (
    <div className='modal-backdrop'>
      <div className='modal'>
        <div className='modal-content'>
          <div className='modal-header'></div>
          <h4 className='modal-title'>{title}</h4>
        </div>
        <div className='modal-body'>{children}</div>
        <div className='modal-footer'>
          <button className='bg-red-500' onClick={() => onClose(false)}>
            Close
          </button>
          {button}
        </div>
      </div>
    </div>
  );
};

export default Modal;
