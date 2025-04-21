// frontend/src/styles/AuthStyles.js
import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

// --- Estilos Globais ---
export const GlobalAuthStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

  body, html {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
    line-height: 1.5;
    color: #fff;
  }
  *, *::before, *::after {
    box-sizing: inherit;
  }

  #root, body, html {
      background-color: #1e1e27;
  }
`;

// --- Estilos de Componentes Reutilizáveis ---

// Estilos para o container principal
export const AuthContainer = styled.div`
  background-color: #1e1e27;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  overflow: auto;
`;

// Estilos para o formulário
export const AuthForm = styled.form`
  background-color: #282c34; /* Cor de fundo do formulário */
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px; /* Largura máxima para o formulário */
  display: flex;
  flex-direction: column; /* Organiza elementos em coluna */
`;

// Estilos para o ícone/Logo
export const LogoIcon = styled.div`
  color: #9886ea; /* Cor do ícone */
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 20px;
`;

// Estilos para o título
export const AuthTitulo = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 15px;
`;

// Estilos para a descrição
export const AuthDescricao = styled.p`
  color: #ccc;
  text-align: center;
  margin-bottom: 25px;
  font-size: 0.9em;
`;

// Estilos para os containers dos campos (label + input)
export const CampoContainer = styled.div`
  margin-bottom: 20px;
`;

// Estilos para os labels
export const InputLabel = styled.label`
  color: #fff;
  display: block;
  margin-bottom: 5px;
  font-size: 0.95em;
`;

// Estilos para os inputs
export const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #44475a; /* Borda escura */
  border-radius: 4px;
  background-color: #3e4152; /* Fundo do input */
  color: #fff; /* Texto branco */
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #9886ea; /* Borda destacada ao focar */
  }
`;

// Estilos para o botão de submit
export const AuthBotao = styled.button`
  background-color: #9886ea; /* Cor principal do tema */
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #806cd5; /* Tom mais escuro ao hover */
  }
`;

// Estilos para o container do link (cadastro ou login)
export const LinkContainer = styled.p`
  color: #ccc;
  font-size: 0.9em;
  text-align: center;
  margin-top: 20px;
`;

// Estilos para o link (usando Link do react-router-dom)
export const StyledLink = styled(Link)`
  color: #9886ea;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// --- Estilos para a Navbar ---
export const NavbarContainer = styled.nav`
  width: 100%;
  padding: 15px 30px;
  background-color: #282c34;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
`;

export const NavbarTitle = styled.div`
  color: #fff;
  font-size: 1.5em;
  font-weight: 700;
`;

export const NavbarButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

// Estilo para os botões na navbar (usando styled(Link) para navegação)
export const NavbarButton = styled(Link)`
  padding: 8px 15px;
  border: 1px solid #9886ea;
  border-radius: 4px;
  background-color: transparent;
  color: #9886ea;
  text-decoration: none;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
  text-align: center;

  &:hover {
    background-color: #9886ea;
    color: #fff;
  }
`;
