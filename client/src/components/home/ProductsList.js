import { useLocation, useNavigate, useParams } from 'react-router-dom';

import useSWR from 'swr';
import MenuCard from './MenuCard';

function useProduct(category_id) {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(
    `http://192.168.1.119:3000/products/${category_id}`,
    fetcher
  );
  return {
    products: data,
    error,
    loading: !data && !error,
  };
}

const ProductsList = () => {
  const { state } = useLocation();
  const { category } = useParams();
  const navigate = useNavigate();
  const { products, errProduct } = useProduct(category);

  return (
    <div className='fixed w-full h-full bg-stone-100 z-10'>
      {!products && !errProduct && <div>Loading...</div>}
      {errProduct && <div>No products</div>}
      {products && (
        <div className='flex flex-col gap-8 items-center '>
          <div className='sticky top-0  bg-white bg-opacity-50 w-full text-center shadow-sm'>
            <h2>Our {state.name}</h2>
            <button
              className='fixed bottom-20 left-6 '
              onClick={() => navigate(-1)}>
              <i className='fa-solid fa-chevron-left text-sm pr-2' />
              Go back
            </button>
          </div>
          <div className='flex flex-col gap-10 w-11/12'>
            {products.map((product) => (
              <MenuCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList;
