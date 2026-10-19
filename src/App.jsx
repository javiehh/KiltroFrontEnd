import { Route, Routes } from 'react-router-dom';
import { ROLES } from './data/constantes.js';
import StoreLayout from './components/layout/StoreLayout.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

import HomePage from './pages/store/HomePage.jsx';
import ProductsPage from './pages/store/ProductsPage.jsx';
import ProductDetailPage from './pages/store/ProductDetailPage.jsx';
import CategoriesPage from './pages/store/CategoriesPage.jsx';
import OffersPage from './pages/store/OffersPage.jsx';
import CartPage from './pages/store/CartPage.jsx';
import CheckoutPage from './pages/store/CheckoutPage.jsx';
import PaymentResultPage from './pages/store/PaymentResultPage.jsx';
import LoginPage from './pages/store/LoginPage.jsx';
import RegisterPage from './pages/store/RegisterPage.jsx';
import AboutPage from './pages/store/AboutPage.jsx';
import BlogPage from './pages/store/BlogPage.jsx';
import BlogDetailPage from './pages/store/BlogDetailPage.jsx';
import ContactPage from './pages/store/ContactPage.jsx';
import NotFoundPage from './pages/store/NotFoundPage.jsx';

import DashboardPage from './pages/admin/DashboardPage.jsx';
import OrdersPage from './pages/admin/OrdersPage.jsx';
import OrderDetailPage from './pages/admin/OrderDetailPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProductDetailPage from './pages/admin/AdminProductDetailPage.jsx';
import ProductEditorPage from './pages/admin/ProductEditorPage.jsx';
import CriticalProductsPage from './pages/admin/CriticalProductsPage.jsx';
import ProductReportsPage from './pages/admin/ProductReportsPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import CategoryEditorPage from './pages/admin/CategoryEditorPage.jsx';
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx';
import UserDetailPage from './pages/admin/UserDetailPage.jsx';
import UserEditorPage from './pages/admin/UserEditorPage.jsx';
import UserHistoryPage from './pages/admin/UserHistoryPage.jsx';
import ReportsPage from './pages/admin/ReportsPage.jsx';
import ProfilePage from './pages/admin/ProfilePage.jsx';

const SOLO_ADMIN = [ROLES.ADMIN];
const solo = (pagina) => <ProtectedRoute roles={SOLO_ADMIN}>{pagina}</ProtectedRoute>;

/**
 * Mapa de navegación (Figuras 2, 3 y 10 del Anexo 1 de la Evaluación 2).
 * Tienda: pública. Panel: Administrador y Vendedor; lo que modifica datos, solo el Administrador.
 */
export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="productos/:id" element={<ProductDetailPage />} />
        <Route path="categorias" element={<CategoriesPage />} />
        <Route path="categorias/:id" element={<CategoriesPage />} />
        <Route path="ofertas" element={<OffersPage />} />
        <Route path="carrito" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="compra/exitosa/:numero" element={<PaymentResultPage exito />} />
        <Route path="compra/error/:numero" element={<PaymentResultPage exito={false} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.VENDEDOR]}><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="ordenes" element={<OrdersPage />} />
        <Route path="ordenes/:numero" element={<OrderDetailPage />} />
        <Route path="productos" element={<AdminProductsPage />} />
        <Route path="productos/nuevo" element={solo(<ProductEditorPage />)} />
        <Route path="productos/criticos" element={<CriticalProductsPage />} />
        <Route path="productos/reportes" element={solo(<ProductReportsPage />)} />
        <Route path="productos/:id" element={<AdminProductDetailPage />} />
        <Route path="productos/:id/editar" element={solo(<ProductEditorPage />)} />
        <Route path="categorias" element={solo(<AdminCategoriesPage />)} />
        <Route path="categorias/nueva" element={solo(<CategoryEditorPage />)} />
        <Route path="categorias/:id/editar" element={solo(<CategoryEditorPage />)} />
        <Route path="usuarios" element={solo(<AdminUsersPage />)} />
        <Route path="usuarios/nuevo" element={solo(<UserEditorPage />)} />
        <Route path="usuarios/:run" element={solo(<UserDetailPage />)} />
        <Route path="usuarios/:run/editar" element={solo(<UserEditorPage />)} />
        <Route path="usuarios/:run/historial" element={solo(<UserHistoryPage />)} />
        <Route path="reportes" element={solo(<ReportsPage />)} />
        <Route path="perfil" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}
