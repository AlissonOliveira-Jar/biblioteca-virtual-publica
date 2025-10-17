import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <section className="text-center py-20 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-900 to-violet-500 mb-4">
        Bem-vindo à Biblioteca Virtual
      </h1>

      <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
        O seu portal para um mundo de conhecimento. Gerencie seus livros, acompanhe suas leituras e descubra novas obras em um só lugar.
      </p>
      
      <div className="flex items-center gap-6">
          <Link 
            to="/register" 
            className="px-8 py-3 text-lg font-bold text-white bg-gradient-to-r from-purple-900 to-violet-500 
                      rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                      transition-all duration-500 cursor-pointer"
          >
            Comece Agora
          </Link>
          <Link 
            to="/login" 
            className="text-lg font-medium text-gray-300 hover:text-primary transition-colors cursor-pointer"
          >
            Já tenho uma conta
          </Link>
        </div>
    </section>
  );
};

export default LandingPage;
