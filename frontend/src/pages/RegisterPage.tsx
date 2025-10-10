import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as Form from '@radix-ui/react-form';
import { useUserRegistrationHook } from "../hooks/registrationUserHook";
import type { RegistrationUserSchema } from "../schemas/registrationUserSchema";
import PasswordInput from '../components/PasswordInput';
import { calculateStrength } from '../utils/passwordStrength';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

const RegisterPage = () => {
    const { register, handleSubmit, errors, watch } = useUserRegistrationHook();

    const passwordValue = watch('password');

    const strengthScore = calculateStrength(passwordValue || '');

    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string | null>(null);

    const onSubmit = async (data: RegistrationUserSchema) => {
        setIsLoading(true);
        setApiError(null);
        
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { confirmPassword, agreeToTerms, ...apiData } = data;
        
        try {
            const response = await axios.post('/api/auth/register', apiData);
            console.log("Usuário criado:", response.data);
            alert("Cadastro realizado com sucesso! Você será redirecionado para o login.");
            window.location.href = '/login';

        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                setApiError(error.response.data.message || 'Erro ao processar a solicitação.');
            } else {
                setApiError("Não foi possível conectar ao servidor. Tente novamente mais tarde.");
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
            <h1 className="text-2xl font-bold text-center mb-4">Crie sua Conta</h1>

            <Form.Field name="name" className="flex flex-col gap-2 mb-2">
                <Form.Label>Nome:</Form.Label>
                <Form.Control asChild>
                    <input 
                        type="text" 
                        id="name" 
                        placeholder="Digite o seu nome completo" 
                        {...register("name")}
                        className="h-10 pl-2 rounded-md border border-slate-300"
                    />
                </Form.Control>
                {errors.name && (<small className="text-red-500 italic">{errors.name.message}</small>)}
            </Form.Field>

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
                {errors.email && (<small className="text-red-500 italic">{errors.email.message}</small>)}
            </Form.Field>

            <PasswordInput
                label="Senha:"
                id="password"
                placeholder="Digite a sua senha"
                {...register("password")}
            />
            {errors.password && (<small className="text-red-500 italic">{errors.password.message}</small>)}

            <PasswordStrengthMeter score={strengthScore} />

            <PasswordInput
                label="Confirmar Senha:"
                id="confirmPassword"
                placeholder="Confirme a sua senha"
                {...register("confirmPassword")}
            />
            {errors.confirmPassword && (<small className="text-red-500 italic">{errors.confirmPassword.message}</small>)}
            
            <Form.Field name="agreeToTerms" className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-2">
                    <Form.Control asChild>
                        <input type="checkbox" id="agreeToTerms" {...register("agreeToTerms")} />
                    </Form.Control>
                    <Form.Label htmlFor="agreeToTerms">Eu li e aceito os termos e condições.</Form.Label>
                </div>
                {errors.agreeToTerms && (<small className="text-red-500 italic">{errors.agreeToTerms.message}</small>)}
            </Form.Field>
            
            {apiError && (<div className="text-red-500 italic text-center my-2">{apiError}</div>)}
            
            <Form.Submit asChild>
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 rounded-md my-2 text-white font-bold
                               bg-gradient-to-r from-blue-600 to-violet-600 
                               hover:scale-105 hover:shadow-lg hover:shadow-violet-500/50 
                               transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Enviando...' : 'Cadastrar'}
                </button>
            </Form.Submit>

            <div className="text-center mt-4">
                <Link to="/login" className="text-blue-600 hover:underline">
                    Já tem uma conta? Faça login
                </Link>
            </div>
        </Form.Root>
    );
};

export default RegisterPage;
