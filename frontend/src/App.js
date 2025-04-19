import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthScreen from './pages/AuthScreen';
import CadastroScreen from './pages/CadastroScreen';
import LoginScreen from './pages/LoginScreen';
import Home from './pages/Home'; // Importe a Home, se ainda não estiver

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Rota para a página inicial */}
        <Route path="/auth" element={<AuthScreen />} /> {/* Tela com botões Login/Cadastro */}
        <Route path="/cadastro" element={<CadastroScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        {/* Podemos adicionar uma rota para "Esqueci a senha" posteriormente */}
      </Routes>
    </Router>
  );
}

export default App;