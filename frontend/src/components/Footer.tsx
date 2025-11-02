import { FaGithub } from 'react-icons/fa';

const Footer = () => {
  const githubRepoUrl = "https://github.com/AlissonOliveira-Jar/biblioteca-virtual-publica";

  return (
    <footer className="bg-zinc-900 text-gray-400 mt-auto">
      <div className="container mx-auto px-6 py-3">
        <div className="flex justify-center items-center gap-4">
          
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Biblioteca Virtual Pública. Todos os direitos reservados.
          </p>
          
          <a 
            href={githubRepoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Link para o repositório do projeto no GitHub"
            className="text-2xl text-gray-400 hover:text-primary transition-colors duration-300 cursor-pointer"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
