import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from './hooks/useAuth.js';
import { useSessionTimeout } from './hooks/useSessionTimeout.js';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Products from './pages/Products.jsx';
import Categories from './pages/Categories.jsx';
import Suppliers from './pages/Suppliers.jsx';
import Entries from './pages/Entries.jsx';
import Exits from './pages/Exits.jsx';
import Users from './pages/Users.jsx';
import Movements from './pages/Movements.jsx';
import PasswordReset from './pages/PasswordReset.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Loading from './components/Loading.jsx';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  
  // Activar timeout de sesión
  useSessionTimeout();

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/entries" element={<Entries />} />
            <Route path="/exits" element={<Exits />} />
            <Route path="/movements" element={<Movements />} />
            <Route path="/users" element={<Users />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
          <Footer />
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
}

export default App;

