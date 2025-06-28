import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load all pages
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Catalog = React.lazy(() => import('./pages/Catalog'));
const Contact = React.lazy(() => import('./pages/Contact'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Orders = React.lazy(() => import('./pages/Orders'));
const OrderDetail = React.lazy(() => import('./pages/OrderDetail'));
const Login = React.lazy(() => import('./pages/Login'));
const Profile = React.lazy(() => import('./pages/Profile'));
const AdminLogin = React.lazy(() => import('./pages/AdminLogin'));
const AdminSetup = React.lazy(() => import('./pages/AdminSetup'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
              {/* Admin routes without header/footer */}
              <Route path="/admin/login" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminLogin />
                </Suspense>
              } />
              <Route path="/admin/setup" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AdminSetup />
                </Suspense>
              } />
              <Route 
                path="/admin/dashboard" 
                element={
                  <Suspense fallback={<LoadingSpinner />}>
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  </Suspense>
                } 
              />
              
              {/* Regular routes with header/footer */}
              <Route path="/*" element={
                <>
                  <Header />
                  <main className="flex-grow">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/chi-siamo" element={<About />} />
                        <Route path="/catalogo" element={<Catalog />} />
                        <Route path="/contatti" element={<Contact />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                        <Route path="/prodotto/:id" element={<ProductDetail />} />
                        <Route path="/login" element={<Login />} />
                        
                        {/* Protected routes - require authentication */}
                        <Route path="/carrello" element={
                          <ProtectedRoute>
                            <Cart />
                          </ProtectedRoute>
                        } />
                        <Route path="/checkout" element={
                          <ProtectedRoute>
                            <Checkout />
                          </ProtectedRoute>
                        } />
                        <Route path="/ordini" element={
                          <ProtectedRoute>
                            <Orders />
                          </ProtectedRoute>
                        } />
                        <Route path="/ordini/:orderId" element={
                          <ProtectedRoute>
                            <OrderDetail />
                          </ProtectedRoute>
                        } />
                        <Route path="/profilo" element={
                          <ProtectedRoute>
                            <Profile />
                          </ProtectedRoute>
                        } />
                      </Routes>
                    </Suspense>
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;