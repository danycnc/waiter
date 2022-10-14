import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { preOrdersSlicer } from '../slicers/preOrdersSlicer';
import { OrdersSlicer } from '../slicers/orderSlicer';
import useSWR from 'swr';
import io from 'socket.io-client';
import StatusBar from '../components/home/StatusBar';
import Modal from '../components/Modal';
import { CSSTransition } from 'react-transition-group';
import appetizer from '../assets/appetizer.jpg';
import hamburger from '../assets/hamburger.jpg';
import beverage from '../assets/beverage.jpg';

function useCheckSession(tid, sid) {
  const fetcher = (url) =>
    fetch(url).then((res) => {
      if (!res.ok) {
        const error = new Error();
        throw error;
      }
      return res.json();
    });

  const { data, error } = useSWR(
    tid ? `http://192.168.1.119:3000/login/${tid}/${sid}` : null,
    fetcher
  );
  return {
    check: data,
    error,
    loading: !data && !error,
  };
}

function useCategories() {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR(
    'http://192.168.1.119:3000/categories',
    fetcher
  );
  return {
    categories: data,
    error,
    loading: !data && !error,
  };
}

const Homepage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const preOrders = useSelector((state) => state.preOrders);
  const dispatch = useDispatch();

  const [socket, setSocket] = useState(null);
  const [tableByPath, setTableByPath] = useState(0);
  const [sessionByPath, setSessionByPath] = useState();
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setTableByPath(location.pathname.split('/')[2]);
    setSessionByPath(location.pathname.split('/')[3]);
  }, []);

  useEffect(() => {
    const newSocket = io.connect('http://192.168.1.119:3000');
    setSocket(newSocket);
  }, [tableByPath]);

  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('connected...');
        socket.emit('join_room', tableByPath);
      });

      socket.on('update_orders', () => {
        console.log('New update...');
        fetchOrders();
      });

      socket.on('disconnect', () => {});
    }
  }, [socket]);

  const { check, error: errCheck } = useCheckSession(
    tableByPath,
    sessionByPath
  );
  const { categories, error: errCateg } = useCategories();

  const sendOrders = () => {
    setIsLoading(true);
    setIsError(false);

    fetch(`http://192.168.1.119:3000/orders/${tableByPath}/${sessionByPath}`, {
      method: 'POST',
      body: JSON.stringify(preOrders),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.ok) {
          setIsLoading(false);
          dispatch(preOrdersSlicer.actions.reset());
          socket.emit('send_orders', tableByPath);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        console.log('ERROR!!!');
      });
  };

  const fetchOrders = () => {
    fetch(`http://192.168.1.119:3000/orders/${tableByPath}`)
      .then((res) => res.json())
      .then((data) => dispatch(OrdersSlicer.actions.populate(data)));
  };

  const loadCategoryImg = (categoryName) => {
    if (categoryName === 'Appetizers') return appetizer;
    else if (categoryName === 'Hamburghers') return hamburger;
    else return beverage;
  };

  return (
    <div>
      {!check && !errCheck && <div>Loading...</div>}
      {errCheck && <div>Invalid credentials</div>}
      {check && (
        <div>
          <StatusBar currentSession={{ tableByPath, sessionByPath }} />

          <div className='flex flex-col items-center gap-4 h-screen bg-stone-100'>
            <h2>Menu</h2>
            {!categories && !errCateg && <div>Loading...</div>}
            {errCateg && <div>no menu</div>}
            {categories &&
              categories.map((category) => (
                <div
                  key={category.id}
                  className='relative flex items-end w-3/4 bg-slate-300 rounded-lg h-40 '
                  onClick={() =>
                    navigate(String(category.id), {
                      state: { name: category.name },
                    })
                  }>
                  <img
                    className='object-cover h-full w-full rounded-lg'
                    src={loadCategoryImg(category.name)}
                    alt='bg-img'
                  />
                  <h3 className='absolute rounded-lg text-white bg-black bg-opacity-50 px-1'>
                    {category.name}
                  </h3>
                </div>
              ))}

            {
              <CSSTransition
                in={preOrders.length !== 0}
                timeout={500}
                classNames='scale'
                unmountOnExit>
                <button
                  className='relatve fixed bottom-20 right-6 z-30 font-bold text-3xl text-white bg-emerald-500 '
                  onClick={() => setShowCart(!showCart)}>
                  <i className='fa-solid fa-cart-shopping'></i>
                  <p className='badge'>{preOrders.length}</p>
                </button>
              </CSSTransition>
            }

            {
              <CSSTransition
                in={showCart}
                timeout={500}
                classNames='scale'
                unmountOnExit>
                <Modal
                  title={'Cart'}
                  onClose={setShowCart}
                  button={
                    preOrders.length !== 0 && (
                      <button className='bg-emerald-400' onClick={sendOrders}>
                        {(isLoading && (
                          <span className='animate-pulse'>
                            Sending orders...
                          </span>
                        )) || <span>Send orders</span>}
                      </button>
                    )
                  }>
                  {isError && (
                    <div className='flex flex-col items-center'>
                      <i className='text-red-600 fa-solid fa-warning text-4xl' />
                      <h3>Something gone wrong! Try again</h3>
                      <h4>Orders have not been sent</h4>
                    </div>
                  )}
                  {preOrders.length !== 0 && (
                    <table>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Qty.</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {preOrders.map((preOrder) => (
                          <tr key={preOrder.product.id}>
                            <td>{preOrder.product.name}</td>
                            <td>{preOrder.quantity} pz.</td>
                            <td>{preOrder.product.price}€</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}

                  {preOrders.length === 0 && !isError && (
                    <div className='flex flex-col items-center'>
                      <i className='px-2 py-1 fa-solid fa-check text-4xl bg-green-600 rounded-full text-white' />
                      <h3>Order sent!</h3>
                    </div>
                  )}
                </Modal>
              </CSSTransition>
            }

            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;
