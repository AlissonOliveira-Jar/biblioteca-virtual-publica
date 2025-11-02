import { FaHardHat } from 'react-icons/fa';

const ServerErrorPage = () => {
  
  const handleReload = () => {
    window.location.href = '/home'; 
  };

  return (
    <section className="text-center py-20 flex flex-col items-center">
      <FaHardHat className="text-yellow-400 text-6xl mb-4" />

      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-500 mb-4 leading-snug">
        500 - Erro Interno do Servidor
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        Oops! Parece que algo quebrou do nosso lado. Nossa equipe já foi notificada. 
        Por favor, tente novamente mais tarde.
      </p>
      
      <div className="flex items-center">
          <button 
            onClick={handleReload}
            className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-900 to-violet-500 
                      rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                      transition-all duration-500 cursor-pointer"
          >
            Voltar para a Home
          </button>
        </div>
    </section>
  );
};

export default ServerErrorPage;
