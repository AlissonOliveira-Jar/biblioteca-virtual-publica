import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-zinc-900 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={isAuthenticated ? "/home" : "/"} className="text-xl font-bold text-gray-100 hover:text-primary transition-colors">
          Biblioteca Virtual Pública
        </Link>
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-primary border border-primary rounded-md 
                         cursor-pointer hover:shadow-lg hover:shadow-gray-500/20 hover:text-white 
                         transition-all duration-500 hover:scale-105"
            >
              <FaSignOutAlt />
              Sair
            </button>
          ) : (
            <>
              <Link 
                to="/login" 
                className="px-4 py-2 text-primary border border-primary rounded-md 
                           cursor-pointer hover:shadow-lg hover:shadow-gray-500/20 hover:text-white 
                           transition-all duration-500 hover:scale-105"
              >
                Entrar
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-2 border border-none rounded-md text-white font-bold
                            bg-gradient-to-r from-purple-900 to-violet-500
                            hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                            transition-all duration-500 cursor-pointer"
              >
                Cadastrar
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
