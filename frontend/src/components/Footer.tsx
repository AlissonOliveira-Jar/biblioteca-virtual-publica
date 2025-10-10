const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-6 py-4 text-center">
        <p>&copy; {new Date().getFullYear()} Biblioteca Virtual Pública. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
