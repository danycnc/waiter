import tableICO from '../../assets/table.png';
import useSWR from 'swr';
import { useGetTables } from '../../hooks/useGetTables';

// function useGetTables() {
//   const fetcher = (url) => fetch(url).then((res) => res.json());

//   const { data, error } = useSWR('http://192.168.1.119:3000/tables', fetcher);
//   return {
//     tables: data ?? [],
//     error,
//     loading: !data && !error,
//   };
// }

const TablesMap = ({ setTableID }) => {
  const { tables, error } = useGetTables();

  return (
    <div className='grid grid-cols-4 gap-10'>
      {tables.length === 0 && !error && <div>Loading...</div>}
      {error && <div>An error has occurred</div>}

      {tables
        .sort((a, b) => a.id - b.id)
        .map((table) => (
          <button
            className={
              table.reserved
                ? 'bg-slate-400'
                : 'bg-emerald-300 focus:bg-yellow-400'
            }
            onClick={() => setTableID(table.id)}
            disabled={table.reserved}
            key={table.id}>
            <img src={tableICO} width={48} alt='table' />
            {table.id}
          </button>
        ))}
    </div>
  );
};

export default TablesMap;
