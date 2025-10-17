import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const NotFoundPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="text-center py-20 flex flex-col items-center">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4" />

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-4 leading-tight">
        404 - Página Não Encontrada
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        Oops! A página que você está procurando não existe ou foi movida para outro local.
      </p>
      
      <div className="flex items-center">
          <Link 
            to={isAuthenticated ? '/home' : '/'} 
            className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-900 to-violet-500 
                      rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                      transition-all duration-500 cursor-pointer"
          >
            Voltar para a Página Inicial
          </Link>
        </div>
    </section>
  );
};

export default NotFoundPage;
