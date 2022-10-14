import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from '../Modal';
import QRCode from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

const StatusBar = () => {
  const location = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [notification, setNotification] = useState(false);

  const orders = useSelector((state) => state.orders);
  // const preOrders = useSelector((state) => state.preOrders);

  useEffect(() => {
    !showOrders && orders.length !== 0 && setNotification(true);
  }, [orders]);

  return (
    <div className='flex justify-between items-center border-t-[1px] p-1 fixed bottom-0 bg-white z-50 w-full'>
      {/* <h5>Table no.{currentSession.tableByPath} </h5> */}
      <div className='flex gap-1 flex-1 justify-around'>
        <button
          className='status-ico'
          onClick={() => {
            setShowCode(!showCode);
          }}>
          <i className='fa-solid fa-qrcode' />
        </button>
        <button
          className='status-ico'
          onClick={() => {
            setShowOrders(!showOrders);
            setNotification(false);
          }}>
          <i className='fa-solid fa-box' />
          {notification && (
            <p className='badge shake-top'>
              <i className='fa-solid fa-bell text-xs' />
            </p>
          )}
        </button>

        <button
          className='status-ico'
          onClick={() => setShowCheckout(!showCheckout)}>
          <i className='fa-solid fa-cash-register' />
        </button>
        {
          <CSSTransition
            in={showCode}
            timeout={500}
            classNames='scale'
            unmountOnExit>
            <Modal title={'Code'} onClose={setShowCode}>
              <QRCode
                id='qr-gen'
                value={`http://192.168.1.119:3001${location.pathname}`}
                size={272}
                level={'H'}
                includeMargin={true}
              />
              <p className='text-gray-600 text-center'>
                Share this code with friends if they want to order too
              </p>
            </Modal>
          </CSSTransition>
        }

        {
          <CSSTransition
            in={showCheckout}
            timeout={500}
            classNames='scale'
            unmountOnExit>
            <Modal
              title={'Check-Out'}
              onClose={setShowCheckout}
              button={<button>Pay</button>}>
              <div>
                Total:{' '}
                {orders.reduce(
                  (total, curr) => total + curr.quantity * curr.Product.price,
                  0
                )}
                €
              </div>
            </Modal>
          </CSSTransition>
        }
        {
          <CSSTransition
            in={showOrders}
            timeout={500}
            classNames='scale'
            unmountOnExit>
            <Modal title={'Orders'} onClose={setShowOrders}>
              {orders && (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Qty.</th>
                      <th>Price</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td>{order.Product.name}</td>
                        <td>{order.quantity} pz.</td>
                        <td>{order.Product.price}€</td>
                        {order.status === 'Scheduled' && (
                          <td>
                            <p className='scheduled'>
                              {order.status}{' '}
                              <i className='fa-solid fa-trash-can text-sm' />
                            </p>
                          </td>
                        )}

                        {order.status === 'In progress...' && (
                          <td>
                            <p className='progress'>{order.status}</p>
                          </td>
                        )}

                        {order.status === 'Delivering...' && (
                          <td>
                            <p className='delivering'>{order.status}</p>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Modal>
          </CSSTransition>
        }
      </div>
    </div>
  );
};

export default StatusBar;
