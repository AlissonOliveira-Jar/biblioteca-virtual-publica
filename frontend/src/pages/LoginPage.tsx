import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import * as Form from '@radix-ui/react-form';
import toast from 'react-hot-toast';
import { useLoginUserForm } from "../hooks/loginUserHook";
import type { LoginUserSchema } from "../schemas/loginUserSchema";
import PasswordInput from '../components/PasswordInput';
import { useAuth } from '../hooks/useAuth';
import { FaGoogle } from 'react-icons/fa';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';


const LoginPage = () => {
  const { register, handleSubmit, errors } = useLoginUserForm();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const { login } = useAuth();

  const onSubmit = async (data: LoginUserSchema) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await axios.post('/api/auth/login', data); 
      const token = response.data.token;
      
      login(token);
      toast.success('Login efetuado com sucesso!');

    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data.message || 'Credenciais inválidas.';
        setApiError(errorMessage);
        toast.error(errorMessage);
      } else {
        const serverErrorMessage = 'Não foi possível conectar ao servidor.';
        setApiError(serverErrorMessage);
        toast.error(serverErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <Form.Root
        onSubmit={handleSubmit(onSubmit)}
        className="w-96 bg-zinc-800 p-6 rounded-lg border border-zinc-700 shadow-2xl shadow-primary/20"
        noValidate
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-100">Login</h1>
        
        <Form.Field name="email" className="flex flex-col gap-2 mb-2">
          <Form.Label className="text-gray-400">E-mail:</Form.Label>
          <Form.Control asChild>
            <input 
              type="email" 
              id="email" 
              placeholder="Digite o seu e-mail" 
              {...register("email")}
              className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
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
                      bg-gradient-to-r from-purple-900 to-violet-500 
                      hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                      transition-all duration-500 cursor-pointer
                      disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </Form.Submit>
        
        <div className="relative flex items-center justify-center my-4">
          <div className="flex-grow border-t border-zinc-600"></div>
          <span className="flex-shrink mx-4 text-zinc-400 text-sm">OU</span>
          <div className="flex-grow border-t border-zinc-600"></div>
        </div>

        <a
          href={`${BACKEND_URL}/oauth2/authorization/google`}
          className="w-full h-11 rounded-md text-gray-300 font-semibold
                     flex items-center justify-center gap-2
                     bg-zinc-900 border border-zinc-700
                     hover:bg-zinc-700
                     transition-colors duration-300 cursor-pointer"
          style={{ textDecoration: 'none' }}
        >
          <FaGoogle />
          Entrar com Google
        </a>

        <div className="text-center mt-6">
          <Link to="/register" className="text-gray-400 hover:text-primary transition-colors">
            Não tem uma conta? Cadastre-se
          </Link>
        </div>
      </Form.Root>
    </div>
  );
};

export default LoginPage;
