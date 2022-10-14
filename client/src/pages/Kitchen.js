import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const Kitchen = () => {
  const [socket, setSocket] = useState(null);
  const [orders, setOrders] = useState();

  useEffect(() => {
    if (socket) {
      socket.on('new_orders', () => {
        console.log('UPDATE');
        fetcher();
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

  //------------------

  const changeStatus = (oid, status) => {
    fetch(`http://192.168.1.119:3000/orders/${oid}/${status}`, {
      method: 'PATCH',
    })
      .then((res) => {
        if (res.ok) {
          socket.emit('refresh_all');
          fetcher();
        }
        res.json();
      })
      .catch((err) => err.message);
  };

  return (
    orders && (
      <table className='text-xl'>
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
          {orders
            .filter((order) => order.status !== 'Delivering...')
            .map((order) => (
              <tr key={order.id}>
                <td className='w-14 text-red-500 font-bold '>{order.table}</td>
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

                    <td>
                      <button
                        onClick={() => changeStatus(order.id, 'In progress...')}
                        className='bg-red-500 text-white'>
                        TAKE IT
                      </button>
                    </td>
                  </>
                )}
                {order.status === 'In progress...' && (
                  <>
                    <td>
                      <p className='progress'>{order.status}</p>
                    </td>
                    <td></td>

                    <td>
                      <button
                        onClick={() => changeStatus(order.id, 'Delivering...')}
                        className='bg-emerald-400'>
                        DONE
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    )
  );
};

function waiting(date) {
  const milliseconds = Date.now() - date;
  const minutes = Math.floor(milliseconds / 1000 / 60);

  return minutes;
}

export default Kitchen;
