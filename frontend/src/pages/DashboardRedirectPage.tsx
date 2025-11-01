import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

const DashboardRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      console.log("Token JWT recebido via Google:", token);
      
      login(token); 
      
      toast.success('Login com Google efetuado com sucesso!');
      
      navigate('/home', { replace: true });

    } else {
      console.error("Callback do Google sem token.");
      toast.error('Falha ao autenticar com Google. Tente novamente.');

      navigate('/login', { replace: true });
    }
    
  }, [searchParams, navigate, login]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center text-gray-300">
      <FaSpinner className="animate-spin text-5xl mb-4" />
      <h1 className="text-xl">Autenticando com Google...</h1>
    </div>
  );
};

export default DashboardRedirectPage;
