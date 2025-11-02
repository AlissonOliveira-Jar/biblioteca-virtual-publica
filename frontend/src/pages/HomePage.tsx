import { Link } from 'react-router-dom';
import { FaSearch, FaBook, FaCompass, FaUser, FaCog, FaUserTie, FaBuilding, FaNewspaper, FaBookOpen } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';

const HomePage = () => {
const { userName, roles } = useAuth();

  const userRoles = roles || [];
  const isAdmin = userRoles.includes('ADMIN');
  const isBibliotecario = userRoles.includes('BIBLIOTECARIO');
  const canManageAcervo = isAdmin || isBibliotecario;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 mb-2">
          Bem-vindo(a) de volta, {userName || 'Usuário'}!
        </h1>
        <p className="text-lg text-gray-400">
          Explore um universo de conhecimento ao seu alcance.
        </p>
      </header>

      <div className="mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título, autor ou ISBN..."
            className="w-full h-14 pl-12 pr-4 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          {/* Card: Minha Estante */}
          <Link to="/my-books" className="group block">
            <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer h-full">
              <FaBook className="text-4xl text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Minha Estante</h2>
              <p className="text-gray-400">
                Acesse seus livros, favoritos e seu histórico de leitura.
              </p>
            </div>
          </Link>

          {/* Card: Descobrir Livros */}
          <Link to="/discover" className="group block">
            <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer h-full">
              <FaCompass className="text-4xl text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Descobrir Livros</h2>
              <p className="text-gray-400">
                Explore nosso catálogo, veja recomendações e os lançamentos mais recentes.
              </p>
            </div>
          </Link>

          {/* Card: Meu Perfil */}
          <Link to="/profile" className="group block">
            <div className="p-6 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-primary hover:scale-105 transition-all duration-300 cursor-pointer h-full">
              <FaUser className="text-4xl text-primary mb-4" />
              <h2 className="text-2xl font-bold text-gray-100 mb-2">Meu Perfil</h2>
              <p className="text-gray-400">
                Gerencie suas informações pessoais, configurações e preferências.
              </p>
            </div>
          </Link>

          {/* Card: Gerenciar Autores */}
          {canManageAcervo && (
            <Link to="/autores" className="group block">
              <div className="p-6 bg-zinc-800 rounded-lg border border-blue-500 hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                <FaUserTie className="text-4xl text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Gerenciar Autores</h2>
                <p className="text-gray-400">
                  Adicionar, editar ou remover autores do sistema.
                </p>
              </div>
            </Link>
          )}

          {/* Card: Gerenciar Editoras */}
          {canManageAcervo && (
            <Link to="/editoras" className="group block">
              <div className="p-6 bg-zinc-800 rounded-lg border border-blue-500 hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                <FaBuilding className="text-4xl text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Gerenciar Editoras</h2>
                <p className="text-gray-400">
                  Adicionar, editar ou remover editoras do sistema.
                </p>
              </div>
            </Link>
          )}

          {/* Card: Gerenciar Artigos */}
          {canManageAcervo && (
            <Link to="/artigos" className="group block">
              <div className="p-6 bg-zinc-800 rounded-lg border border-blue-500 hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                <FaNewspaper className="text-4xl text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Gerenciar Artigos</h2>
                <p className="text-gray-400">
                  Adicionar, editar ou remover artigos científicos.
                </p>
              </div>
            </Link>
          )}

          {/* Card: Gerenciar Livros */}
          {canManageAcervo && (
            <Link to="/livros" className="group block">
              <div className="p-6 bg-zinc-800 rounded-lg border border-blue-500 hover:border-blue-400 hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                <FaBookOpen className="text-4xl text-blue-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Gerenciar Livros</h2>
                <p className="text-gray-400">
                  Adicionar, editar ou remover livros.
                </p>
              </div>
            </Link>
          )}

          {/* Card: de Administração */}
          {isAdmin && (
            <Link to="/admin" className="group block">
              <div className="p-6 bg-zinc-800 rounded-lg border border-yellow-500 hover:border-yellow-400 hover:scale-105 transition-all duration-300 cursor-pointer h-full">
                <FaCog className="text-4xl text-yellow-500 mb-4" />
                <h2 className="text-2xl font-bold text-gray-100 mb-2">Administração</h2>
                <p className="text-gray-400">
                  Gerenciar usuários e configurações do sistema.
                </p>
              </div>
            </Link>
          )}

        </div>
      </main>
    </div>
  );
};

export default HomePage;
