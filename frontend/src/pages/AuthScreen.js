import React from 'react';
import { Link } from 'react-router-dom';

function AuthScreen() {
  return (
    <div>
      <h1>Bem-vindo à Biblioteca!</h1>
      <Link to="/login">
        <button>Login</button>
      </Link>
      <Link to="/cadastro">
        <button>Cadastro</button>
      </Link>
    </div>
  );
}

export default AuthScreen;