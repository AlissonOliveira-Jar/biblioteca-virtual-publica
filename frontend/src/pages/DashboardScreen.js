import React from 'react';

import {
    NavbarContainer,
    NavbarTitle,
    NavbarButtonContainer
} from '../styles/AuthStyles';

import {
    DashboardContainer,
    SearchBarContainer,
    SearchInput,
    ContentArea,
    LogoutButton
} from '../styles/DashboardStyles';

import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function DashboardScreen() {
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleLogout = async () => {
        console.log('Logout clicado');

        const logoutEndpoint = `${apiBaseUrl}/auth/logout`;

        try {
            const response = await axios.post(logoutEndpoint);
            console.log('Resposta do logout do backend:', response.status);

            localStorage.removeItem('token');

            navigate('/login');
        } catch (error) {
            console.error('Erro ao chamar endpoint de logout no backend:', error);

            localStorage.removeItem('token');

            navigate('/login');
        }
    };


    return (
        <DashboardContainer>
            <NavbarContainer>
                <NavbarTitle>
                    Biblioteca Virtual Pública
                </NavbarTitle>
                <NavbarButtonContainer>
                     <LogoutButton onClick={handleLogout}>
                         Sair
                     </LogoutButton>

                </NavbarButtonContainer>
            </NavbarContainer>

            <SearchBarContainer>
                <SearchInput type="text" placeholder="Buscar livros, autores, etc." />
            </SearchBarContainer>

            <ContentArea>
                <h2>Bem-vindo(a)!</h2>
                <p>Utilize a barra de busca para encontrar obras ou navegue pelas secções em breve.</p>
            </ContentArea>

        </DashboardContainer>
    );
}

export default DashboardScreen;
