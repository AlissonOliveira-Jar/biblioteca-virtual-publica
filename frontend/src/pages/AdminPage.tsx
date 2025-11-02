import axios from 'axios';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

import { FaSpinner, FaUsers, FaEdit, FaTrash, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import * as Dialog from '@radix-ui/react-dialog';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Form from '@radix-ui/react-form';
import { CheckIcon } from '@radix-ui/react-icons';
import PasswordInput from '../components/PasswordInput';
import { authService } from '../services/authService';

import type { UserProfile } from '../services/userService';

const ALL_ROLES = ['USER', 'BIBLIOTECARIO', 'ADMIN'];

const AdminPage = () => {
  const { userId: currentAdminId, logout } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserProfile | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  const [isSavingRoles, setIsSavingRoles] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);

  const [isPasswordConfirmOpen, setIsPasswordConfirmOpen] = useState(false);
  const [passwordToConfirm, setPasswordToConfirm] = useState('');
  const [rolesToSaveAfterConfirm, setRolesToSaveAfterConfirm] = useState<string[]>([]);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isBibliotecarioConfirmOpen, setIsBibliotecarioConfirmOpen] = useState(false);
  const [rolesToSaveAfterBibliotecarioConfirm, setRolesToSaveAfterBibliotecarioConfirm] = useState<string[]>([]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        setIsLoading(true);
        const allUsers = await userService.getAllUsers();
        setUsers(allUsers);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        toast.error('Não foi possível carregar a lista de usuários.');
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();
  }, [logout]);

  const handleOpenEditModal = (user: UserProfile) => {
    setUserToEdit(user);
    setSelectedRoles(new Set(user.roles));
    setIsRoleModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsRoleModalOpen(false);
    setUserToEdit(null);
    setSelectedRoles(new Set());
  };

  const handleRoleChange = (role: string, checked: boolean | 'indeterminate') => {
    if (role === 'USER' && checked === false) {
      toast.error("A role 'USER' não pode ser removida.");
      return;
    }

    setSelectedRoles(prevRoles => {
      const newRoles = new Set(prevRoles);
      if (checked === true) {
        newRoles.add(role);
        if (role === 'ADMIN' || role === 'BIBLIOTECARIO') {
           newRoles.add('USER');
        }
      } else {
        if (role !== 'USER') {
            newRoles.delete(role);
        }
      }
      return newRoles;
    });
  };

const handleSaveRoles = async () => {
    if (!userToEdit) return;

    const finalRoles = new Set(selectedRoles);
    finalRoles.add('USER');
    const rolesArray = Array.from(finalRoles);

    const addingBibliotecario = rolesArray.includes('BIBLIOTECARIO') && !userToEdit.roles.includes('BIBLIOTECARIO');
    const addingAdmin = rolesArray.includes('ADMIN') && !userToEdit.roles.includes('ADMIN');

    if (addingBibliotecario) {
      setRolesToSaveAfterBibliotecarioConfirm(rolesArray);
      setIsBibliotecarioConfirmOpen(true);
      setIsRoleModalOpen(false);
      return;
    } else if (addingAdmin) {
      setRolesToSaveAfterConfirm(rolesArray);
      setIsPasswordConfirmOpen(true);
      setPasswordToConfirm('');
      setIsRoleModalOpen(false);
      return;
    }

    setIsSavingRoles(true);
    try {
      const updatedUser = await userService.updateUserRoles(userToEdit.id, rolesArray);
      setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
      toast.success(`Roles de ${updatedUser.name} atualizadas!`);
      handleCloseEditModal();
    } catch (error) {
      console.error('Erro ao atualizar roles:', error);
      toast.error('Não foi possível atualizar as roles.');
    } finally {
      setIsSavingRoles(false);
    }
  };

  const handlePasswordConfirmSubmit = async () => {
    if (!userToEdit || rolesToSaveAfterConfirm.length === 0) return;

    setIsVerifyingPassword(true);
    try {
      const isPasswordCorrect = await authService.verifyCurrentUserPassword(passwordToConfirm);

      if (isPasswordCorrect) {
        const updatedUser = await userService.updateUserRoles(userToEdit.id, rolesToSaveAfterConfirm);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success(`Role ADMIN atribuída a ${updatedUser.name} com sucesso!`);
        setIsPasswordConfirmOpen(false);
        setPasswordToConfirm('');
        setRolesToSaveAfterConfirm([]);
        handleCloseEditModal();
      } else {
        toast.error("Senha incorreta. A alteração não foi salva.");
      }
    } catch (error) {
       console.error('Erro ao verificar senha ou salvar roles:', error);
       toast.error('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsVerifyingPassword(false);
    }
  };


  const handleConfirmBibliotecarioAndProceed = async () => {
    if (!userToEdit || rolesToSaveAfterBibliotecarioConfirm.length === 0) return;

    const rolesToSave = rolesToSaveAfterBibliotecarioConfirm;
    const addingAdmin = rolesToSave.includes('ADMIN') && !userToEdit.roles.includes('ADMIN');

    setIsBibliotecarioConfirmOpen(false);

    if (addingAdmin) {
      setRolesToSaveAfterConfirm(rolesToSave);
      setIsPasswordConfirmOpen(true);
      setPasswordToConfirm('');
    } else {
      setIsSavingRoles(true);
      try {
        const updatedUser = await userService.updateUserRoles(userToEdit.id, rolesToSave);
        setUsers(prevUsers => prevUsers.map(u => u.id === updatedUser.id ? updatedUser : u));
        toast.success(`Roles de ${updatedUser.name} atualizadas com sucesso!`);
        handleCloseEditModal();
      } catch (error) {
        console.error('Erro ao atualizar roles após confirmação:', error);
        toast.error('Não foi possível atualizar as roles.');
      } finally {
        setIsSavingRoles(false);
        setRolesToSaveAfterBibliotecarioConfirm([]);
      }
    }
  };

  const handleOpenDeleteModal = (user: UserProfile) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    if (userToDelete.id === currentAdminId) {
       toast.error("Você não pode excluir sua própria conta.");
       return;
    }

    setIsDeletingUser(true);
    try {
      await userService.deleteUserById(userToDelete.id);
      setUsers(prevUsers => prevUsers.filter(u => u.id !== userToDelete.id));
      toast.success(`Usuário ${userToDelete.name} excluído com sucesso.`);
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
       if (axios.isAxiosError(error) && error.response?.data?.message) {
        toast.error(`Erro: ${error.response.data.message}`);
      } else {
        toast.error('Não foi possível deletar o usuário.');
      }
    } finally {
      setIsDeletingUser(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary text-4xl" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-800 to-violet-500 mb-8 text-center flex items-center justify-center gap-4">
        <FaUsers />
        Painel Administrativo
      </h1>

      {/* Tabela de Usuários */}
      <div className="bg-zinc-800 p-6 rounded-lg border border-zinc-700">
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Gerenciar Usuários</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="border-b border-zinc-600">
              <tr>
                <th className="p-4 text-gray-400">Nome</th>
                <th className="p-4 text-gray-400">Email</th>
                <th className="p-4 text-gray-400">Roles</th>
                <th className="p-4 text-gray-400 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-zinc-700 hover:bg-zinc-700/50">
                  <td className="p-4 text-gray-100">{user.name}</td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4 text-gray-300">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map(role => (
                        <span key={role} className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap">
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 space-x-2 text-right">
                    <button
                      onClick={() => handleOpenEditModal(user)}
                      className="px-3 py-1 text-sm bg-yellow-600 hover:bg-yellow-500 text-white rounded disabled:opacity-50 transition-colors"
                      title="Editar Roles"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleOpenDeleteModal(user)}
                      disabled={user.id === currentAdminId}
                      className="px-3 py-1 text-sm bg-red-600 hover:bg-red-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title={user.id === currentAdminId ? "Você não pode se excluir" : "Deletar Usuário"}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL DE EDIÇÃO DE ROLES --- */}
      <Dialog.Root open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-zinc-700 p-6 shadow-lg z-50 focus:outline-none">
            <Dialog.Title className="text-gray-100 text-xl font-bold mb-4">
              Editar Roles de {userToEdit?.name}
            </Dialog.Title>
            <Dialog.Description className="text-gray-400 mb-5 text-sm">
              Selecione as permissões para este usuário.
            </Dialog.Description>

            <fieldset className="mb-4 flex flex-col gap-3">
              {ALL_ROLES.map((role) => (
                <div className="flex items-center gap-2" key={role}>
                  <Checkbox.Root
                    className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-zinc-700 outline-none data-[state=checked]:bg-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-zinc-800 disabled:bg-zinc-600 disabled:cursor-not-allowed"
                    id={`role-${role}`}
                    checked={selectedRoles.has(role)}
                    onCheckedChange={(checked) => handleRoleChange(role, checked)}
                    disabled={role === 'USER'}
                  >
                    <Checkbox.Indicator className="text-white">
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  <label className={`text-sm select-none ${role === 'USER' ? 'text-gray-500 cursor-not-allowed' : 'text-gray-300'}`} htmlFor={`role-${role}`}>
                    {role} {role === 'USER' ? '(Obrigatório)' : ''}
                  </label>
                </div>
              ))}
            </fieldset>

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500 transition-colors"
                  onClick={handleCloseEditModal}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handleSaveRoles}
                disabled={isSavingRoles}
                className="px-4 py-2 bg-primary text-white rounded hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[80px]"
              >
                {isSavingRoles ? <FaSpinner className="animate-spin"/> : 'Salvar'}
              </button>
            </div>

            <Dialog.Close asChild>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200" aria-label="Fechar" onClick={handleCloseEditModal}>
                <FaTimes />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* --- MODAL DE CONFIRMAÇÃO DE DELEÇÃO --- */}
      <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-red-500/50 p-6 shadow-lg z-50 focus:outline-none">
             <Dialog.Title className="text-red-500 text-xl font-bold mb-4 flex items-center gap-2">
              <FaExclamationTriangle /> Confirmação Necessária
            </Dialog.Title>
            <Dialog.Description className="text-gray-300 mb-5 text-sm">
              Você tem certeza que deseja excluir permanentemente o usuário <strong>{userToDelete?.name}</strong> ({userToDelete?.email})? Esta ação não pode ser desfeita.
            </Dialog.Description>
             <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500 transition-colors"
                  onClick={handleCloseDeleteModal}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeletingUser}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
              >
                {isDeletingUser ? <FaSpinner className="animate-spin"/> : 'Excluir Permanentemente'}
              </button>
            </div>
             <Dialog.Close asChild>
              <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200" aria-label="Fechar" onClick={handleCloseDeleteModal}>
                <FaTimes />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* --- MODAL DE CONFIRMAÇÃO (BIBLIOTECARIO ROLE) --- */}
      <Dialog.Root open={isBibliotecarioConfirmOpen} onOpenChange={setIsBibliotecarioConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-yellow-500/50 p-6 shadow-lg z-50 focus:outline-none">
             <Dialog.Title className="text-yellow-500 text-xl font-bold mb-4 flex items-center gap-2">
              <FaExclamationTriangle /> Confirmação Importante
            </Dialog.Title>
            <Dialog.Description className="text-gray-300 mb-5 text-sm">
              Você está prestes a atribuir a role <strong>BIBLIOTECARIO</strong> a {userToEdit?.name}. Isso concederá permissões significativas para gerenciar o acervo da biblioteca (livros, autores, etc.).
              <br/><br/>
              Deseja continuar?
            </Dialog.Description>

             <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500 transition-colors"
                  onClick={() => { setIsBibliotecarioConfirmOpen(false); setRolesToSaveAfterBibliotecarioConfirm([]); handleCloseEditModal(); }}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handleConfirmBibliotecarioAndProceed}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors flex items-center justify-center min-w-[100px]"
              >
                Confirmar
              </button>
            </div>
             <Dialog.Close asChild>
               <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200" aria-label="Fechar" onClick={() => { setIsBibliotecarioConfirmOpen(false); setRolesToSaveAfterBibliotecarioConfirm([]); handleCloseEditModal(); }}>
                 <FaTimes />
               </button>
             </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* --- MODAL DE CONFIRMAÇÃO DE SENHA (ADMIN ROLE) --- */}
      <Dialog.Root open={isPasswordConfirmOpen} onOpenChange={setIsPasswordConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
          <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-yellow-500/50 p-6 shadow-lg z-50 focus:outline-none">
             <Dialog.Title className="text-yellow-500 text-xl font-bold mb-4 flex items-center gap-2">
              <FaExclamationTriangle /> Confirmação de Segurança
            </Dialog.Title>
            <Dialog.Description className="text-gray-300 mb-5 text-sm">
              Para atribuir a role <strong>ADMIN</strong> a {userToEdit?.name}, por favor, confirme sua identidade digitando sua senha atual.
            </Dialog.Description>

            <Form.Root onSubmit={(e) => e.preventDefault()}>
              <fieldset className="mb-4">
                 <PasswordInput
                   label="Sua Senha Atual:"
                   id="adminPasswordConfirm"
                   placeholder="Digite sua senha"
                   value={passwordToConfirm}
                   onChange={(e) => setPasswordToConfirm(e.target.value)}
                 />
              </fieldset>
            </Form.Root>

             <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  className="px-4 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500 transition-colors"
                  onClick={() => { setIsPasswordConfirmOpen(false); setPasswordToConfirm(''); setRolesToSaveAfterConfirm([]); handleCloseEditModal(); }}
                >
                  Cancelar
                </button>
              </Dialog.Close>
              <button
                onClick={handlePasswordConfirmSubmit} 
                disabled={isVerifyingPassword || passwordToConfirm.length < 1}
                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center justify-center min-w-[150px]"
              >
                {isVerifyingPassword ? <FaSpinner className="animate-spin"/> : 'Confirmar e Salvar'}
              </button>
            </div>
             <Dialog.Close asChild>
               <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-200" aria-label="Fechar" onClick={() => { setIsPasswordConfirmOpen(false); setPasswordToConfirm(''); setRolesToSaveAfterConfirm([]); handleCloseEditModal(); }}>
                 <FaTimes />
               </button>
             </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  );
};

export default AdminPage;
