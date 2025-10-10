import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Form from '@radix-ui/react-form';
import { useLoginUserForm } from "../hooks/loginUserHook";
import type { LoginUserSchema } from "../schemas/loginUserSchema";
import PasswordInput from '../components/PasswordInput';

const LoginPage = () => {
  const { register, handleSubmit, errors } = useLoginUserForm();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: LoginUserSchema) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axios.post('/api/auth/login', data);
      const token = response.data.token;
      localStorage.setItem('authToken', token);
      alert('Login efetuado com sucesso!');
      window.location.href = '/dashboard';

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setApiError(error.response.data.message || 'Credenciais inválidas.');
      } else {
        setApiError('Não foi possível conectar ao servidor.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form.Root
      onSubmit={handleSubmit(onSubmit)}
      className="w-96 bg-white p-4 rounded-md border border-slate-300"
      noValidate
    >
      <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
      
      <Form.Field name="email" className="flex flex-col gap-2 mb-2">
        <Form.Label>E-mail:</Form.Label>
        <Form.Control asChild>
          <input 
            type="email" 
            id="email" 
            placeholder="Digite o seu e-mail" 
            {...register("email")}
            className="h-10 pl-2 rounded-md border border-slate-300"
          />
        </Form.Control>
        {errors.email && (
          <small className="text-red-500 italic">{errors.email.message}</small>
        )}
      </Form.Field>

      <PasswordInput
        label="Senha:"
        id="password"
        placeholder="Digite a sua senha"
        {...register("password")}
      />
       {errors.password && (
          <small className="text-red-500 italic">{errors.password.message}</small>
      )}

      {apiError && (
        <div className="text-red-500 italic text-center my-2">{apiError}</div>
      )}

      <Form.Submit asChild>
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-11 rounded-md my-2 text-white font-bold
                     bg-gradient-to-r from-blue-600 to-violet-600 
                     hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50 
                     transition-all duration-500 disabled:opacity-50"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </Form.Submit>

      <div className="text-center mt-4">
        <Link to="/register" className="text-blue-600 hover:underline">
          Não tem uma conta? Cadastre-se
        </Link>
      </div>
    </Form.Root>
  );
};

export default LoginPage;
