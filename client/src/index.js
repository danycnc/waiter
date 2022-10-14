import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import FirstStep from './components/totem/FirstStep';
import Login from './pages/Login';
import SecondStep from './components/totem/SecondStep';
import { Provider } from 'react-redux';
import { store } from './store';
import ThirdStep from './components/totem/ThirdStep';
import Homepage from './pages/Homepage';
import ProductsList from './components/home/ProductsList';
import Kitchen from './pages/Kitchen';
import Dashboard from './pages/Dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='home/:table/:session' element={<Homepage />}>
          <Route path=':category' element={<ProductsList />} />
        </Route>
        <Route path='firstStep' element={<FirstStep />} />
        <Route path='secondStep' element={<SecondStep />} />
        <Route path='thirdStep' element={<ThirdStep />} />
        <Route path='login' element={<Login />} />
        <Route path='kitchen' element={<Kitchen />} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
