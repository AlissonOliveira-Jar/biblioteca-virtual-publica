import React from 'react';
import styled from 'styled-components';

import {
  NavbarContainer,
  NavbarTitle,
  NavbarButtonContainer,
  NavbarButton,
} from '../styles/AuthStyles';


const LandingContainer = styled.div`
  background-color: #1e1e27;
  min-height: 100vh;
  width: 100%;
  padding-top: 70px;
  color: #fff;
`;


function LandingScreen() {
  return (
    <LandingContainer>
      {/* Renderiza a Navbar */}
      <NavbarContainer>
        <NavbarTitle>
          Biblioteca Virtual Pública
        </NavbarTitle>
        <NavbarButtonContainer>
          {/* Botão que navega para a rota /cadastro */}
          <NavbarButton to="/cadastro">
            Cadastrar-se
          </NavbarButton>
          {/* Botão que navega para a rota /login */}
          <NavbarButton to="/login">
            Login
          </NavbarButton>
        </NavbarButtonContainer>
      </NavbarContainer>

      {/* Conteúdo principal da página inicial abaixo da navbar */}
      {/* Este é apenas um exemplo, você pode estilizar e adicionar o que quiser aqui */}
      <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
          <h1>Bem-vindo(a)!</h1>
          <p>Explore o vasto acervo da nossa Biblioteca Virtual.</p>
          {/* Adicione imagens, descrições, etc. */}
      </div>

    </LandingContainer>
  );
}

export default LandingScreen;
