import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

// Estilos para o container principal
const CadastroContainer = styled.div`
  background-color: #1e1e27;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

// Estilos para o formulário
const CadastroForm = styled.form`
  background-color: #282c34;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
`;

// Estilos para o ícone (adicione seu ícone aqui)
const LogoIcon = styled.div`
  color: #9886ea;
  font-size: 2.5em;
  text-align: center;
  margin-bottom: 20px;
`;

// Estilos para o título
const CadastroTitulo = styled.h2`
  color: #fff;
  text-align: center;
  margin-bottom: 15px;
`;

// Estilos para a descrição
const CadastroDescricao = styled.p`
  color: #ccc;
  text-align: center;
  margin-bottom: 25px;
  font-size: 0.9em;
`;

// Estilos para os containers dos campos (label + input)
const CampoContainer = styled.div`
  margin-bottom: 20px;
`;

// Estilos para os labels
const InputLabel = styled.label`
  color: #fff;
  display: block;
  margin-bottom: 5px;
  font-size: 0.95em;
`;

// Estilos para os inputs
const InputField = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #44475a;
  border-radius: 4px;
  background-color: #3e4152;
  color: #fff;
  font-size: 1em;

  &:focus {
    outline: none;
    border-color: #9886ea;
  }
`;

// Estilos para o botão de cadastro
const CadastroBotao = styled.button`
  background-color: #9886ea;
  color: #fff;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.1em;
  width: 100%;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #806cd5;
  }
`;

// Estilos para o container do link de login
const LoginLinkContainer = styled.p`
  color: #ccc;
  font-size: 0.9em;
  text-align: center;
  margin-top: 20px;

  a {
    color: #9886ea;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();
  const backendURL = 'http://localhost:8080/api/auth/register';

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(backendURL, {
        nome,
        email,
        senha,
      });
      console.log('Resposta do cadastro:', response.data);
      if (response.status === 201) {
        alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
        navigate('/login');
      } else {
        alert('Erro ao cadastrar: ' + (response.data.message || 'Erro desconhecido'));
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao cadastrar: ' + (error.response?.data?.message || error.message || 'Erro de conexão com o servidor'));
    }
  };

  return (
    <CadastroContainer>
      <CadastroForm onSubmit={handleSubmit}>
        <LogoIcon>💎</LogoIcon> {/* Adicione seu ícone aqui */}
        <CadastroTitulo>Crie uma Conta</CadastroTitulo>
        <CadastroDescricao>
          Crie sua conta para ter acesso a Biblioteca Pública Virtual
        </CadastroDescricao>
        <CampoContainer>
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
        <CadastroBotao type="submit">Cadastrar</CadastroBotao>
        <LoginLinkContainer>
            Já tem uma conta? <Link to="/login">Entrar</Link>
        </LoginLinkContainer>
      </CadastroForm>
    </CadastroContainer>
  );
}

export default CadastroScreen;