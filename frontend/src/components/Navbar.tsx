import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-zinc-900 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-100 hover:text-primary transition-colors">
          Biblioteca Virtual Pública
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-primary border border-primary rounded-md 
                       hover:bg-primary hover:text-white 
                       transition-all duration-300 hover:scale-105"
          >
            Entrar
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 text-white font-bold 
                       bg-gradient-to-r from-primary via-violet-500 to-primary 
                       bg-[size:200%_auto] animate-gradient-flow rounded-md 
                       hover:scale-105 transition-transform"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
