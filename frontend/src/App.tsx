import { Routes, Route, Link, Navigate } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage.tsx';
import LoginPage from './pages/LoginPage.tsx';

function App() {
  return (
    <div className="bg-zinc-100 min-h-screen w-full flex flex-col items-center gap-6 pt-8">
      <nav>
        <Link to="/login" className="text-lg font-medium p-4 hover:text-blue-600">Login</Link>
        <Link to="/register" className="text-lg font-medium p-4 hover:text-blue-600">Cadastro</Link>
      </nav>
      
      <Routes>
        <Route path="/" element={<Navigate to="/register" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  );
};

export default App;
