import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';

const ForbiddenPage = () => {
  return (
    <section className="text-center py-20 flex flex-col items-center">
      <FaLock className="text-red-500 text-6xl mb-4" />

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 mb-4 leading-snug">
        403 - Acesso Negado
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        Você não tem as permissões necessárias para visualizar esta página.
      </p>
      
      <div className="flex items-center">
          <Link 
            to="/home" 
            className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-900 to-violet-500 
                      rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                      transition-all duration-500 cursor-pointer"
          >
            Voltar para a Home
          </Link>
        </div>
    </section>
  );
};

export default ForbiddenPage;
