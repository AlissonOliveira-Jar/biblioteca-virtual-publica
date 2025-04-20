// frontend/src/pages/LoginScreen.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AuthContainer,
  AuthForm,
  LogoIcon,
  AuthTitulo,
  AuthDescricao,
  CampoContainer,
  InputLabel,
  InputField,
  AuthBotao,
  LinkContainer,
  StyledLink
} from '../styles/AuthStyles';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Use a variável de ambiente
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const loginEndpoint = `${apiBaseUrl}/auth/login`; // Ajuste o endpoint de login se for diferente

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Assumindo que seu endpoint de login espera email e senha e retorna um token/dados do usuário
      const response = await axios.post(loginEndpoint, {
        email,
        senha,
      });
      console.log('Resposta do login:', response.data);

      // Lógica para lidar com login bem-sucedido
      if (response.status === 200) { // Assumindo status 200 para sucesso no login
         // Ex: Armazenar token JWT ou dados do usuário
         // localStorage.setItem('token', response.data.token);
         // localStorage.setItem('user', JSON.stringify(response.data.user));

         alert('Login bem-sucedido!');
         navigate('/dashboard'); // Redirecione para a página inicial após login
      } else {
          alert('Login bem-sucedido (resposta inesperada): ' + JSON.stringify(response.data));
      }

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      let errorMessage = 'Erro ao fazer login. Verifique suas credenciais.';
      if (error.response) {
        console.error('Dados do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        if (error.response.data && error.response.data.message) {
             errorMessage = 'Erro ao fazer login: ' + error.response.data.message;
        } else if (error.response.status === 401) {
             errorMessage = 'Email ou senha inválidos.';
        } else {
             errorMessage = 'Erro ao fazer login: Status ' + error.response.status;
        }
      } else if (error.request) {
        errorMessage = 'Erro de conexão. Verifique sua internet ou tente mais tarde.';
      } else {
        errorMessage = 'Ocorreu um erro inesperado. Detalhes: ' + error.message;
      }
      alert(errorMessage);
    }
  };

  return (
    <AuthContainer>
      <AuthForm onSubmit={handleSubmit}>
        {/* Use o elemento <i> com as classes Font Awesome */}
        <LogoIcon>
             <i className="fas fa-book-open"></i> {/* Ícone de livro aberto sólido, ou fa-book */}
        </LogoIcon>
        <AuthTitulo>Faça Login</AuthTitulo>
        <AuthDescricao>
          Entre na sua conta para acessar a Biblioteca Pública Virtual
        </AuthDescricao>
         <CampoContainer>
          <InputLabel htmlFor="email">Email</InputLabel>
          <InputField
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </CampoContainer>
        <CampoContainer>
          <InputLabel htmlFor="senha">Senha</InputLabel>
          <InputField
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </CampoContainer>
        <AuthBotao type="submit">Entrar</AuthBotao>
        <LinkContainer>
            Não tem uma conta? <StyledLink to="/cadastro">Cadastre-se</StyledLink>
        </LinkContainer>
      </AuthForm>
    </AuthContainer>
  );
}

export default LoginScreen;
