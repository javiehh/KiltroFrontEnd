import { Navigate, Route, Routes } from 'react-router-dom';
import { PERMISOS } from './permisos.js';
import { useAuth } from './context/AuthContext.jsx';
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

const requiere = (permiso, pagina) => <ProtectedRoute permiso={permiso}>{pagina}</ProtectedRoute>;

function InicioDelPanel() {
  const { puede } = useAuth();
  return puede(PERMISOS.REPORTES_VER) ? <DashboardPage /> : <Navigate to="ordenes" replace />;
}

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
        <Route path="compra/exitosa/:id" element={<PaymentResultPage exito />} />
        <Route path="compra/error" element={<PaymentResultPage exito={false} />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="nosotros" element={<AboutPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route path="admin" element={requiere(PERMISOS.PANEL, <AdminLayout />)}>
        <Route index element={<InicioDelPanel />} />
        <Route path="ordenes" element={requiere(PERMISOS.ORDENES_VER, <OrdersPage />)} />
        <Route path="ordenes/:id" element={requiere(PERMISOS.ORDENES_VER, <OrderDetailPage />)} />
        <Route path="productos" element={requiere(PERMISOS.PRODUCTOS_VER, <AdminProductsPage />)} />
        <Route path="productos/nuevo" element={requiere(PERMISOS.PRODUCTOS_GESTIONAR, <ProductEditorPage />)} />
        <Route path="productos/criticos" element={requiere(PERMISOS.PRODUCTOS_GESTIONAR, <CriticalProductsPage />)} />
        <Route path="productos/reportes" element={requiere(PERMISOS.REPORTES_VER, <ProductReportsPage />)} />
        <Route path="productos/:id" element={requiere(PERMISOS.PRODUCTOS_VER, <AdminProductDetailPage />)} />
        <Route path="productos/:id/editar" element={requiere(PERMISOS.PRODUCTOS_GESTIONAR, <ProductEditorPage />)} />
        <Route path="categorias" element={requiere(PERMISOS.CATEGORIAS_GESTIONAR, <AdminCategoriesPage />)} />
        <Route path="categorias/nueva" element={requiere(PERMISOS.CATEGORIAS_GESTIONAR, <CategoryEditorPage />)} />
        <Route path="categorias/:id/editar" element={requiere(PERMISOS.CATEGORIAS_GESTIONAR, <CategoryEditorPage />)} />
        <Route path="usuarios" element={requiere(PERMISOS.USUARIOS_GESTIONAR, <AdminUsersPage />)} />
        <Route path="usuarios/nuevo" element={requiere(PERMISOS.USUARIOS_GESTIONAR, <UserEditorPage />)} />
        <Route path="usuarios/:id" element={requiere(PERMISOS.USUARIOS_GESTIONAR, <UserDetailPage />)} />
        <Route path="usuarios/:id/editar" element={requiere(PERMISOS.USUARIOS_GESTIONAR, <UserEditorPage />)} />
        <Route path="usuarios/:id/historial" element={requiere(PERMISOS.USUARIOS_GESTIONAR, <UserHistoryPage />)} />
        <Route path="reportes" element={requiere(PERMISOS.REPORTES_VER, <ReportsPage />)} />
        <Route path="perfil" element={requiere(PERMISOS.PERFIL_PROPIO, <ProfilePage />)} />
      </Route>
    </Routes>
  );
}
