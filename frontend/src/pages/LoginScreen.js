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

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const loginEndpoint = `${apiBaseUrl}/auth/login`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(loginEndpoint, {
        email: email,
        password: senha,
      });
      console.log('Resposta do login:', response.data);

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);

        alert('Login bem-sucedido!');
        navigate('/dashboard');
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
