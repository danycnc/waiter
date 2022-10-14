const TableOrders = ({ orders }) => {
  return (
    <div>
      {orders && (
        <section className='max-h-56 overflow-scroll'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty.</th>
                <th>Price</th>
                <th>Status</th>
                <th>Waiting time</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>{order.Product.name}</td>
                  <td>{order.quantity} pz.</td>
                  <td>{order.Product.price}€</td>
                  {order.status === 'Scheduled' && (
                    <>
                      <td>
                        <p className='scheduled'>
                          {order.status}{' '}
                          <i className='fa-solid fa-trash-can text-sm' />
                        </p>
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
        </section>
      )}
      <div className='text-xl mt-2 flex justify-between'>
        <section>
          <span>Total pieces: </span>
          {orders.reduce((total, curr) => total + curr.quantity, 0)}
        </section>
        <section className='bg-red-400 px-2 rounded'>
          <span>Total: </span>
          {orders.reduce(
            (total, curr) => total + curr.quantity * curr.Product.price,
            0
          )}
          €
        </section>
      </div>
    </div>
  );
};

function waiting(date) {
  const milliseconds = Date.now() - date;
  const minutes = Math.floor(milliseconds / 1000 / 60);

  return minutes;
}

export default TableOrders;
