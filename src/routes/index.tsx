// resources/js/routes/index.tsx
import { createBrowserRouter } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import DashboardStats from '../pages/Dashboard';
import ProductsList from '../pages/ProductsList';
import StocksList from '../pages/StocksList';
import ClientsList from '../pages/ClientsList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashboardStats /> },
      { path: 'products', element: <ProductsList /> },
      { path: 'stocks', element: <StocksList /> },
      { path: 'clients', element: <ClientsList /> },
    ],
  },
]);