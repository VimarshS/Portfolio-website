import { createRoot } from 'react-dom/client';
import App from './App';
import { AdminPage } from './admin/AdminPage';
import './index.css';

// A tiny "router": /admin shows the admin page, everything else shows the portfolio
const isAdminRoute = window.location.pathname.startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  isAdminRoute ? <AdminPage /> : <App />
);