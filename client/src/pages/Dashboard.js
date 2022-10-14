import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useGetTables } from '../hooks/useGetTables';
import tableICO from '../assets/table.png';
import TableOrders from '../components/kitchen/TableOrders';

const Dashboard = () => {
  const [socket, setSocket] = useState(null);
  const [orders, setOrders] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [tableOrdersNumber, setTableOrdersNumber] = useState();
  const { tables, error } = useGetTables();

  useEffect(() => {
    if (socket) {
      socket.on('new_orders', () => {
        console.log('UPDATE');
        fetcher();
        showTableOrders(tableOrdersNumber);
      });
      socket.on('update_orders', () => {
        console.log('REFRESHING');
        fetcher();
        showTableOrders(tableOrdersNumber);
      });
    }
  }, [socket]);

  const fetcher = () => {
    fetch('http://192.168.1.119:3000/orders')
      .then((res) => {
        if (!res.ok) {
          console.log('Hello');
          const error = new Error();
          throw error;
        }
        return res.json();
      })
      .then((data) => {
        setOrders(data.sort((a, b) => a.id - b.id));
      });
  };

  const showTableOrders = (tableId) => {
    if (tableId !== undefined) {
      setTableOrdersNumber(tableId);
      fetch(`http://192.168.1.119:3000/orders/${tableId}`)
        .then((res) => res.json())
        .then((data) => setTableOrders(data));
    }
  };

  useEffect(() => {
    fetcher();
    const newSocket = io.connect('http://192.168.1.119:3000');
    setSocket(newSocket);
  }, []);

  //PAGE REFRESHING
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let interval;
    const updateCounter = () => {
      setCounter((currentValue) => currentValue + 1);
    };

    interval = setInterval(() => {
      updateCounter();
    }, 60000);
    return () => {
      // Clear the interval when component is unmounted
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='p-2 flex gap-4 h-screen bg-slate-100 '>
      <section className='flex flex-col gap-4 w-2/3'>
        <div className='bg-white p-2 shadow-md grid grid-cols-4 gap-10'>
          {tables.length === 0 && !error && <div>Loading...</div>}
          {error && <div>An error has occurred</div>}
          {tables
            .sort((a, b) => a.id - b.id)
            .map((table) => (
              <button
                className={table.reserved ? 'bg-red-400' : ''}
                onClick={() => showTableOrders(table.id)}
                key={table.id}>
                <div className='flex'>
                  <section>
                    <img src={tableICO} width={48} alt='table' />
                    <span>N.{table.id}</span>
                  </section>
                  <section>
                    <p>Pax:</p>
                    <p>
                      Orders:
                      <span className='bg-yellow-400'>
                        {
                          orders.filter((order) => order.table === table.id)
                            .length
                        }
                      </span>
                    </p>
                  </section>
                </div>
              </button>
            ))}
        </div>
        <div className='bg-white p-2 shadow-md'>
          <section className='flex justify-between mb-1'>
            <div>
              <h2>
                Table
                {tableOrdersNumber && (
                  <span className='bg-yellow-400 px-2'>
                    {tableOrdersNumber}
                  </span>
                )}
                's status
              </h2>
              <h4>
                Session ID:{' '}
                {
                  tables.find((table) => table.id === tableOrdersNumber)
                    ?.sessionID
                }
              </h4>
            </div>
            <button onClick={() => showTableOrders(tableOrdersNumber)}>
              <i className='fa-solid fa-rotate-right text-sm'></i>
            </button>
          </section>
          {(tableOrders.length > 0 && <TableOrders orders={tableOrders} />) || (
            <div className='text-center text-gray-400 py-6'>
              <span>No data yet</span>
            </div>
          )}
          <button>Un-reserve table</button>
          <button>Check-out</button>
        </div>
      </section>
      <div className='bg-white p-2 shadow-md h-full overflow-y-scroll'>
        {orders && (
          <>
            <h2>All orders's status</h2>
            <table>
              <thead>
                <tr>
                  <th>Table No.</th>
                  <th>Name</th>
                  <th>Qty.</th>
                  <th>Status</th>
                  <th>Waiting time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className='w-14 text-red-500 font-bold '>
                      {order.table}
                    </td>
                    <td>{order.Product.name}</td>
                    <td>{order.quantity} pz.</td>

                    {order.status === 'Scheduled' && (
                      <>
                        <td>
                          <p className='scheduled'>{order.status}</p>
                        </td>
                        <td
                          className={
                            waiting(Date.parse(order.createdAt)) >= 20
                              ? 'bg-red-400 blink-2'
                              : null
                          }>
                          {waiting(Date.parse(order.createdAt))} min.
                        </td>
                      </>
                    )}
                    {order.status === 'In progress...' && (
                      <>
                        <td>
                          <p className='progress'>{order.status}</p>
                        </td>
                        <td></td>
                      </>
                    )}
                    {order.status === 'Delivering...' && (
                      <>
                        <td>
                          <p className='delivering'>{order.status}</p>
                        </td>
                        <td></td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

function waiting(date) {
  const milliseconds = Date.now() - date;
  const minutes = Math.floor(milliseconds / 1000 / 60);

  return minutes;
}

export default Dashboard;
