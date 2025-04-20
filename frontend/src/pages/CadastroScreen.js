// frontend/src/pages/CadastroScreen.js
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

function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  // Use a variável de ambiente definida no Docker Compose
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const registerEndpoint = `${apiBaseUrl}/auth/register`;

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(registerEndpoint, {
        'name': nome,
        'email': email,
        'password': senha,
      });
      console.log('Resposta do cadastro:', response.data);
      if (response.status === 201) {
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      } else {
         alert('Cadastro bem-sucedido (resposta inesperada): ' + JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      let errorMessage = 'Erro ao cadastrar. Tente novamente.';
      if (error.response) {
        console.error('Dados do erro:', error.response.data);
        console.error('Status do erro:', error.response.status);
        console.error('Headers do erro:', error.response.headers);
        if (error.response.data && error.response.data.message) {
             errorMessage = 'Erro ao cadastrar: ' + error.response.data.message;
        } else {
             errorMessage = 'Erro ao cadastrar: Status ' + error.response.status;
        }
      } else if (error.request) {
        // A requisição foi feita, mas nenhuma resposta foi recebida
        console.error('Erro na requisição:', error.request);
        errorMessage = 'Erro de conexão. Verifique sua internet ou tente mais tarde.';
      } else {
        // Algo aconteceu na configuração da requisição que desencadeou um erro
        console.error('Erro de configuração:', error.message);
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
            <i className="fas fa-book"></i> {/* Ícone de livro sólido */}
        </LogoIcon>
        <AuthTitulo>Crie uma Conta</AuthTitulo>
        <AuthDescricao>
          Crie sua conta para ter acesso a Biblioteca Pública Virtual
        </AuthDescricao>
        <CampoContainer>
          {/* ... (Campos Nome, Email, Senha permanecem os mesmos) */}
          <InputLabel htmlFor="nome">Nome Completo</InputLabel>
          <InputField
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </CampoContainer>
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
        <AuthBotao type="submit">Cadastrar</AuthBotao>
        <LinkContainer>
            Já tem uma conta? <StyledLink to="/login">Entrar</StyledLink>
        </LinkContainer>
      </AuthForm>
    </AuthContainer>
  );
}

export default CadastroScreen;
