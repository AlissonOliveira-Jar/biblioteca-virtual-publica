import { Routes, Route, Outlet } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen"> 
      <Navbar />
      <main className="flex-grow container mx-auto p-4 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
