// src/components/Navbar.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { FaSignOutAlt, FaSearch } from 'react-icons/fa';

import type { ChangeEvent, KeyboardEvent } from 'react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        setSearchTerm('');
    }
  };
 
  return (
    <nav className="bg-zinc-900 shadow-lg shadow-primary/10">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* Título */}
        <Link 
          to={isAuthenticated ? "/home" : "/"} 
          className="text-xl font-bold text-gray-100 hover:text-primary transition-colors shrink-0"
        >
          Biblioteca Virtual Pública
        </Link>

        {/* Centro: Barra de Busca (SÓ APARECE SE ESTIVER LOGADO) */}
        {isAuthenticated && (
          <div className="grow flex justify-center px-4">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Buscar em todo o acervo..."
                className="w-full h-10 pl-10 pr-4 rounded-lg bg-zinc-800 border border-zinc-700 text-white 
                           focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FaSearch 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                size={16}
              />
            </div>
          </div>
        )}

        {/* Direita: Botões de Ação */}
        <div className="flex items-center gap-4 shrink-0">
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
                           bg-linear-to-r from-purple-900 to-violet-500
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
