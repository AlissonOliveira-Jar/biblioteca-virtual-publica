import toast from 'react-hot-toast';
import * as Form from '@radix-ui/react-form';
import PasswordInput from '../components/PasswordInput';
import axios from 'axios';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';
import { FaUserCircle, FaEnvelope, FaCalendarAlt, FaSpinner, FaEdit, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { useUpdateUserProfileForm } from '../hooks/updateUserProfileHook';
import { useUpdateUserPasswordForm } from '../hooks/updateUserPasswordHook';

import type { UpdateUserProfileSchema } from '../schemas/updateUserSchema';
import type { UserProfile, UserUpdateData } from '../services/userService';
import type { UpdateUserPasswordSchema } from '../schemas/updateUserPasswordSchema';

const ProfilePage = () => {
  const { userId, logout, login } = useAuth();
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    errors: errorsProfile, 
    isDirty: isDirtyProfile,
    reset: resetProfile 
  } = useUpdateUserProfileForm({});

  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    errors: errorsPassword, 
    isDirty: isDirtyPassword,
    reset: resetPassword
  } = useUpdateUserPasswordForm();

  useEffect(() => {
    if (!userId) {
      toast.error('ID do usuário não encontrado. Fazendo logout.');
      logout();
      return;
    }

    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const userData = await userService.getUserProfile(userId);
        setUser(userData);
        resetProfile(userData); 
      } catch (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message || 'Não foi possível carregar seu perfil.');
        } else {
          toast.error('Não foi possível carregar seu perfil.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId, logout, resetProfile]);

  const onSubmitUpdateProfile = async (data: UpdateUserProfileSchema) => {
    if (!userId) return;

    setIsUpdatingProfile(true);
    try {
      const updateData: UserUpdateData = { name: data.name, email: data.email };
      
      const response = await userService.updateUserProfile(userId, updateData);
      setUser(response.user);
      resetProfile(response.user); 
      login(response.token);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error('Não foi possível atualizar seu perfil.');
      }
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const onSubmitUpdatePassword = async (data: UpdateUserPasswordSchema) => {
    if (!userId) return;
    
    setIsUpdatingPassword(true);
    try {
      const updateData: UserUpdateData = {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      };
      
      const response = await userService.updateUserProfile(userId, updateData);

      login(response.token); 
      resetPassword(); 
      toast.success('Senha atualizada com sucesso!');

    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error('Não foi possível atualizar sua senha.');
      }
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Você tem certeza absoluta? Esta ação é irreversível e excluirá todos os seus dados permanentemente.")) {
      return;
    }

    setIsDeleting(true);
    try {
      await userService.deleteMyAccount();
      toast.success("Sua conta foi excluída com sucesso. Sentiremos sua falta!");
      logout();
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error("Não foi possível excluir sua conta.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const formatJoinDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  if (!user) {
    return <div className="text-center text-gray-400">Não foi possível carregar o perfil.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 space-y-12">
      
      {/* SEÇÃO 1: VISUALIZAÇÃO DO PERFIL */}
      <section>
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 mb-8 text-center">
          Meu Perfil
        </h1>
        <div className="bg-zinc-800 p-8 rounded-lg border border-zinc-700 shadow-2xl shadow-primary/20">
          <div className="flex flex-col items-center mb-6">
            <FaUserCircle className="text-8xl text-primary mb-4" />
            <h2 className="text-3xl font-bold text-gray-100">{user.name}</h2>
            <span className="text-sm font-medium text-primary bg-primary/20 px-3 py-1 rounded-full mt-2">
              {user.roles.join(', ')}
            </span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-md">
              <FaEnvelope className="text-primary text-xl" />
              <span className="text-gray-300 text-lg">{user.email}</span>
            </div>
            <div className="flex items-center gap-4 p-4 bg-zinc-900 rounded-md">
              <FaCalendarAlt className="text-primary text-xl" />
              <span className="text-gray-300">
                Membro desde: {formatJoinDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: FORMULÁRIO DE ATUALIZAÇÃO DE PERFIL */}
      <section>
        <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center gap-3">
          <FaEdit />
          Editar Informações
        </h2>
        <Form.Root
          onSubmit={handleSubmitProfile(onSubmitUpdateProfile)}
          className="bg-zinc-800 p-8 rounded-lg border border-zinc-700"
        >
          <Form.Field name="name" className="flex flex-col gap-2 mb-4">
            <Form.Label className="text-gray-400">Nome:</Form.Label>
            <Form.Control asChild>
              <input 
                type="text" 
                {...registerProfile("name")} 
                className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Form.Control>
            {errorsProfile.name && (
              <small className="text-red-500 italic">{errorsProfile.name.message}</small>
            )}
          </Form.Field>

          <Form.Field name="email" className="flex flex-col gap-2 mb-4">
            <Form.Label className="text-gray-400">E-mail:</Form.Label>
            <Form.Control asChild>
              <input 
                type="email" 
                {...registerProfile("email")} 
                className="h-10 pl-3 bg-zinc-900 text-white rounded-md border border-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </Form.Control>
            {errorsProfile.email && (
              <small className="text-red-500 italic">{errorsProfile.email.message}</small>
            )}
          </Form.Field>

          <Form.Submit asChild>
            <button 
              type="submit" 
              disabled={isUpdatingProfile || !isDirtyProfile}
              className="w-full h-11 rounded-md my-2 text-white font-bold
                         bg-gradient-to-r from-purple-900 to-violet-500 
                         hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                         transition-all duration-500 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingProfile ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </Form.Submit>
        </Form.Root>
      </section>

      {/* SEÇÃO 3: FORMULÁRIO DE ATUALIZAÇÃO DE SENHA */}
      <section>
        <h2 className="text-2xl font-bold text-gray-200 mb-6 flex items-center gap-3">
          <FaLock />
          Alterar Senha
        </h2>
        <Form.Root
          onSubmit={handleSubmitPassword(onSubmitUpdatePassword)}
          className="bg-zinc-800 p-8 rounded-lg border border-zinc-700"
        >
          <PasswordInput
            label="Senha Atual:"
            id="currentPassword"
            placeholder="Digite sua senha atual"
            {...registerPassword("currentPassword")}
          />
          {errorsPassword.currentPassword && (
            <small className="text-red-500 italic -mt-2 mb-2 block">{errorsPassword.currentPassword.message}</small>
          )}

          <PasswordInput
            label="Nova Senha:"
            id="newPassword"
            placeholder="Digite sua nova senha"
            {...registerPassword("newPassword")}
          />
          {errorsPassword.newPassword && (
            <small className="text-red-500 italic -mt-2 mb-2 block">{errorsPassword.newPassword.message}</small>
          )}

          <PasswordInput
            label="Confirmar Nova Senha:"
            id="confirmNewPassword"
            placeholder="Confirme sua nova senha"
            {...registerPassword("confirmNewPassword")}
          />
          {errorsPassword.confirmNewPassword && (
            <small className="text-red-500 italic -mt-2 mb-2 block">{errorsPassword.confirmNewPassword.message}</small>
          )}

          <Form.Submit asChild>
            <button 
              type="submit" 
              disabled={isUpdatingPassword || !isDirtyPassword}
              className="w-full h-11 rounded-md my-2 text-white font-bold
                         bg-gradient-to-r from-purple-900 to-violet-500 
                         hover:scale-105 hover:shadow-lg hover:shadow-violet-500/20
                         transition-all duration-500 cursor-pointer
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingPassword ? 'Alterando...' : 'Alterar Senha'}
            </button>
          </Form.Submit>
        </Form.Root>
      </section>

      {/* --- SEÇÃO 4: ZONA DE PERIGO --- */}
      <section>
        <h2 className="text-2xl font-bold text-red-500 mb-6 flex items-center gap-3">
          <FaExclamationTriangle />
          Zona de Perigo
        </h2>
        <div className="bg-zinc-800 p-8 rounded-lg border border-red-500/50">
          <h3 className="text-xl font-bold text-gray-100">Excluir Conta</h3>
          <p className="text-gray-400 my-4">
            Ao excluir sua conta, todos os seus dados, incluindo histórico de leitura e favoritos, serão permanentemente removidos. Esta ação não pode ser desfeita.
          </p>
          <button 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full h-11 rounded-md my-2 text-white font-bold
                       bg-red-600 hover:bg-red-700
                       transition-all duration-300 cursor-pointer
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Excluindo...' : 'Excluir minha conta permanentemente'}
          </button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
