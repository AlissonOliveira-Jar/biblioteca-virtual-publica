import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-gray-800">
          Biblioteca Virtual Pública
        </Link>
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-colors duration-300"
          >
            Login
          </Link>
          <Link 
            to="/register" 
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-300"
          >
            Cadastrar
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
