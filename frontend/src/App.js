import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CadastroScreen from './pages/CadastroScreen';
import LoginScreen from './pages/LoginScreen';
import LandingScreen from './pages/LandingScreen';
import { GlobalAuthStyles } from './styles/AuthStyles';

function App() {
  return (
    <>
      {/* Renderiza os estilos globais que incluem o reset de CSS e a fonte */}
      <GlobalAuthStyles />
      <Routes>
        {/* Rota para a tela de login */}
        <Route path="/login" element={<LoginScreen />} />
        {/* Rota para a tela de cadastro */}
        <Route path="/cadastro" element={<CadastroScreen />} />

        {/* Rota para a página inicial (landing page) */}
        {/* CORRIGIDO: Agora renderiza o LandingScreen */}
        <Route path="/" element={<LandingScreen />} />

        {/* Opcional: Adicionar uma rota coringa para lidar com URLs inválidas */}
        {/* import { Navigate } from 'react-router-dom'; */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}

      </Routes>
    </>
  );
}

export default App;
