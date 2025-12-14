import axios from 'axios';
import toast from 'react-hot-toast';

import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { userService } from '../services/userService';

import { FaSpinner, FaUsers, FaEdit, FaTrash, FaUnlock, FaBan, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
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

    const [isUnbanningId, setIsUnbanningId] = useState<string | null>(null);

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
                if (role === 'ADMIN' || role === 'BIBLIOTECARIO') newRoles.add('USER');
            } else {
                if (role !== 'USER') newRoles.delete(role);
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
                toast.success(`Role ADMIN atribuída com sucesso!`);
                setIsPasswordConfirmOpen(false);
                setPasswordToConfirm('');
                setRolesToSaveAfterConfirm([]);
                handleCloseEditModal();
            } else {
                toast.error("Senha incorreta.");
            }
        } catch (error) {
            toast.error('Ocorreu um erro.');
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
                toast.success(`Roles atualizadas com sucesso!`);
                handleCloseEditModal();
            } catch (error) {
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
            toast.success(`Usuário excluído com sucesso.`);
            handleCloseDeleteModal();
        } catch (error) {
            toast.error('Não foi possível deletar o usuário.');
        } finally {
            setIsDeletingUser(false);
        }
    };

    const handleUnbanUser = async (user: UserProfile) => {
        if (!window.confirm(`Tem certeza que deseja remover o banimento de ${user.name}?`)) return;

        setIsUnbanningId(user.id);
        try {
            await userService.unbanUser(user.id);
            toast.success(`${user.name} foi desbanido!`);

            setUsers(prevUsers => prevUsers.map(u => {
                if (u.id === user.id) {
                    return { ...u, isCommentBanned: false, commentBanExpiresAt: null };
                }
                return u;
            }));
        } catch (error) {
            console.error(error);
            toast.error("Erro ao desbanir usuário.");
        } finally {
            setIsUnbanningId(null);
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
                            <tr key={user.id} className={`border-b border-zinc-700 hover:bg-zinc-700/50 ${user.isCommentBanned ? 'bg-red-900/10' : ''}`}>
                                <td className="p-4 text-gray-100">
                                    <div className="flex flex-col">
                                        <span>{user.name}</span>
                                        {/* ✅ Badge de Banido */}
                                        {user.isCommentBanned && (
                                            <span className="inline-flex items-center gap-1 w-fit mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-900 text-red-200 border border-red-700">
                                                <FaBan size={10} />
                                                {user.commentBanExpiresAt ? 'Suspenso' : 'Banido'}
                                            </span>
                                        )}
                                    </div>
                                </td>
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
                                <td className="p-4 flex justify-end items-center gap-2">

                                    {user.isCommentBanned && (
                                        <button
                                            onClick={() => handleUnbanUser(user)}
                                            disabled={isUnbanningId === user.id}
                                            className="px-3 py-1 text-sm bg-green-600 hover:bg-green-500 text-white rounded disabled:opacity-50 transition-colors flex items-center gap-1"
                                            title="Remover Banimento"
                                        >
                                            {isUnbanningId === user.id ? <FaSpinner className="animate-spin" /> : <FaUnlock />}
                                        </button>
                                    )}

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
                                        title="Deletar Usuário"
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

            <Dialog.Root open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-zinc-700 p-6 shadow-lg z-50 focus:outline-none">
                        <Dialog.Title className="text-gray-100 text-xl font-bold mb-4">
                            Editar Roles de {userToEdit?.name}
                        </Dialog.Title>

                        <fieldset className="mb-4 flex flex-col gap-3">
                            {ALL_ROLES.map((role) => (
                                <div className="flex items-center gap-2" key={role}>
                                    <Checkbox.Root
                                        className="flex h-5 w-5 appearance-none items-center justify-center rounded bg-zinc-700 outline-none data-[state=checked]:bg-primary"
                                        id={`role-${role}`}
                                        checked={selectedRoles.has(role)}
                                        onCheckedChange={(checked) => handleRoleChange(role, checked)}
                                        disabled={role === 'USER'}
                                    >
                                        <Checkbox.Indicator className="text-white"><CheckIcon /></Checkbox.Indicator>
                                    </Checkbox.Root>
                                    <label className="text-gray-300 text-sm cursor-pointer" htmlFor={`role-${role}`}>
                                        {role}
                                    </label>
                                </div>
                            ))}
                        </fieldset>

                        <div className="flex justify-end gap-3 mt-6">
                            <Dialog.Close asChild>
                                <button onClick={handleCloseEditModal} className="px-4 py-2 bg-zinc-600 text-gray-200 rounded hover:bg-zinc-500">Cancelar</button>
                            </Dialog.Close>
                            <button onClick={handleSaveRoles} disabled={isSavingRoles} className="px-4 py-2 bg-primary text-white rounded flex items-center hover:bg-violet-700 disabled:opacity-50">
                                {isSavingRoles ? <FaSpinner className="animate-spin" /> : 'Salvar'}
                            </button>
                        </div>
                        <Dialog.Close asChild>
                            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={handleCloseEditModal}>
                                <FaTimes />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-red-500/50 p-6 shadow-lg z-50 focus:outline-none">
                        <Dialog.Title className="text-red-500 font-bold mb-4 text-xl flex items-center gap-2">
                            <FaExclamationTriangle /> Excluir Usuário
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-300 mb-4">
                            Tem certeza que deseja excluir permanentemente <strong>{userToDelete?.name}</strong>?
                        </Dialog.Description>
                        <div className="flex justify-end gap-3">
                            <Dialog.Close asChild>
                                <button onClick={handleCloseDeleteModal} className="px-4 py-2 bg-zinc-600 rounded text-white hover:bg-zinc-500">Cancelar</button>
                            </Dialog.Close>
                            <button onClick={handleConfirmDelete} disabled={isDeletingUser} className="px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center min-w-[100px]">
                                {isDeletingUser ? <FaSpinner className="animate-spin" /> : 'Excluir'}
                            </button>
                        </div>
                        <Dialog.Close asChild>
                            <button className="absolute top-3 right-3 text-gray-400 hover:text-white" onClick={handleCloseDeleteModal}>
                                <FaTimes />
                            </button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={isPasswordConfirmOpen} onOpenChange={setIsPasswordConfirmOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-yellow-500/50 p-6 z-50 focus:outline-none">
                        <Dialog.Title className="text-yellow-500 font-bold mb-4 text-xl flex items-center gap-2">
                            <FaExclamationTriangle /> Confirme sua senha
                        </Dialog.Title>
                        <Dialog.Description className="text-gray-300 mb-4 text-sm">
                            Esta é uma ação sensível. Por favor, confirme sua senha de administrador.
                        </Dialog.Description>

                        <Form.Root onSubmit={(e) => e.preventDefault()}>
                            <PasswordInput
                                id="adminConfirmPass"
                                label=""
                                value={passwordToConfirm}
                                onChange={e => setPasswordToConfirm(e.target.value)}
                                placeholder="Sua senha atual"
                            />
                        </Form.Root>

                        <div className="flex justify-end gap-3 mt-4">
                            <button onClick={() => setIsPasswordConfirmOpen(false)} className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500">Cancelar</button>
                            <button onClick={handlePasswordConfirmSubmit} disabled={isVerifyingPassword || !passwordToConfirm} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 disabled:opacity-50 flex items-center justify-center min-w-[100px]">
                                {isVerifyingPassword ? <FaSpinner className="animate-spin" /> : 'Confirmar'}
                            </button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <Dialog.Root open={isBibliotecarioConfirmOpen} onOpenChange={setIsBibliotecarioConfirmOpen}>
                <Dialog.Portal>
                    <Dialog.Overlay className="bg-black/60 data-[state=open]:animate-overlayShow fixed inset-0 z-40" />
                    <Dialog.Content className="data-[state=open]:animate-contentShow fixed top-1/2 left-1/2 w-[90vw] max-w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-zinc-800 border border-yellow-500/50 p-6 z-50 focus:outline-none">
                        <Dialog.Title className="text-yellow-500 font-bold mb-4 text-xl flex items-center gap-2">
                            <FaExclamationTriangle /> Confirmar Bibliotecário
                        </Dialog.Title>
                        <p className="text-gray-300 mb-4">Deseja tornar este usuário bibliotecário? Ele terá acesso ao gerenciamento de livros.</p>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setIsBibliotecarioConfirmOpen(false)} className="px-4 py-2 bg-zinc-600 text-white rounded hover:bg-zinc-500">Cancelar</button>
                            <button onClick={handleConfirmBibliotecarioAndProceed} className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">Confirmar</button>
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

        </div>
    );
};

export default AdminPage;