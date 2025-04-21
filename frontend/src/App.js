import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

import CadastroScreen from './pages/CadastroScreen';
import LoginScreen from './pages/LoginScreen';
import LandingScreen from './pages/LandingScreen';
import DashboardScreen from './pages/DashboardScreen';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
      return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingScreen />} />

        <Route path="/cadastro" element={<CadastroScreen />} />
        <Route path="/login" element={<LoginScreen />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardScreen />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
  );
}

export default App;
