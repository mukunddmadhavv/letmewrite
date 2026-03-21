import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSession } from './services/auth';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import OrderForm from './pages/OrderForm';
import PaymentConfirm from './pages/PaymentConfirm';
import './index.css';

function ProtectedRoute({ children, session }) {
  return session ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((sessionData) => {
      setSession(sessionData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid #e5e7eb', borderTopColor: '#1d9bf0', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage session={session} />} />
        <Route path="/login"  element={session ? <Navigate to="/dashboard" replace /> : <Login setSession={setSession} />} />
        <Route path="/signup" element={session ? <Navigate to="/dashboard" replace /> : <Signup setSession={setSession} />} />
        <Route path="/dashboard" element={
          <ProtectedRoute session={session}>
            <Dashboard session={session} setSession={setSession} />
          </ProtectedRoute>
        } />
        <Route path="/order" element={
          <ProtectedRoute session={session}>
            <OrderForm session={session} />
          </ProtectedRoute>
        } />
        <Route path="/payment" element={
          <ProtectedRoute session={session}>
            <PaymentConfirm />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
