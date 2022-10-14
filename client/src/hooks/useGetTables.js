import useSWR from 'swr';

export function useGetTables() {
  const fetcher = (url) => fetch(url).then((res) => res.json());

  const { data, error } = useSWR('http://192.168.1.119:3000/tables', fetcher);
  return {
    tables: data ?? [],
    error,
    loading: !data && !error,
  };
}
