import styled from 'styled-components';

export const DashboardContainer = styled.div`
    background-color: #1e1e27;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    color: #fff;
    padding-top: 70px;
    width: 100%;
`;

export const SearchBarContainer = styled.div`
    padding: 1em;
    display: flex;
    justify-content: center;
    background-color: #282c34;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    z-index: 1;
`;

export const SearchInput = styled.input`
    padding: 0.75em 1em;
    font-size: 1em;
    border: 1px solid #44475a;
    border-radius: 20px;
    background-color: #3e4152;
    color: #fff;
    width: 80%;
    max-width: 600px;
    outline: none;
    &:focus {
        border-color: #9886ea;
        box-shadow: 0 0 5px rgba(152, 134, 234, 0.5);
    }
`;

export const ContentArea = styled.div`
    flex-grow: 1;
    padding: 1em;
    h2 {
        color: #fff;
        margin-bottom: 15px;
    }
    p {
        color: #ccc;
        font-size: 0.9em;
    }
`;

export const LogoutButton = styled.button`
    padding: 8px 15px;
    border: 1px solid #9886ea;
    border-radius: 4px;
    background-color: transparent;
    color: #9886ea;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
    text-align: center;

    &:hover {
        background-color: #9886ea;
        color: #fff;
    }
`;
