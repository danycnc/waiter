import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { preOrdersSlicer } from '../../slicers/preOrdersSlicer';

const MenuCard = ({ product }) => {
  const dispatch = useDispatch();
  const storedQuantity = useSelector((state) =>
    state.preOrders.find((preOrder) => preOrder.product.id === product.id)
  );

  const [quantity, setQuantity] = useState(storedQuantity?.quantity || 0);

  const handleQuantity = (operator) => {
    if (operator === '+' && quantity < 12) {
      setQuantity(quantity + 1);
    } else {
      operator === '-' && quantity > 0 && setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    quantity === 0 && dispatch(preOrdersSlicer.actions.delete({ product }));
    quantity !== 0 &&
      dispatch(preOrdersSlicer.actions.populate({ product, quantity }));
  }, [quantity]);

  return (
    <div
      className={
        quantity > 0
          ? 'flex items-center p-3 gap-2 bg-amber-300 rounded-lg'
          : 'flex items-center p-3 gap-2 bg-stone-300 rounded-lg'
      }
      key={product.id}>
      <div className='h-[64px] w-[64px]  bg-stone-500 '></div>
      <div className='flex flex-col flex-1 justify-around'>
        <h4>{product.name}</h4>
        <h4>{product.price}€</h4>
        <span className='italic text-gray-600'>{product.description}</span>
      </div>
      <div className='flex flex-col grow-0 justify-between gap-2'>
        <button
          className='bg-emerald-400 font-bold shadow-sm'
          onClick={() => handleQuantity('+')}>
          +
        </button>
        <input
          readOnly={true}
          name='people'
          value={storedQuantity?.quantity || 0}
          className='grow-0 w-12 text-center font-bold'
          min='0'
          max='12'></input>
        <button
          className='bg-neutral-400 font-bold shadow-sm'
          onClick={() => handleQuantity('-')}>
          -
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
