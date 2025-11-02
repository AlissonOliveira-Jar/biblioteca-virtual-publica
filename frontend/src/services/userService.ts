import api from './api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  roles: string[];
}

export interface UserUpdateData {
  name?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}

export interface UserUpdateResponse {
  user: UserProfile;
  token: string;
}

const getUserProfile = async (id: string): Promise<UserProfile> => {
  const response = await api.get<UserProfile>(`/users/${id}`);
  return response.data;
};

const updateUserProfile = async (id: string, data: UserUpdateData): Promise<UserUpdateResponse> => {
  const response = await api.put<UserUpdateResponse>(`/users/${id}`, data);
  return response.data;
};

const deleteMyAccount = async (): Promise<void> => {
  await api.delete('/users');
};

const getAllUsers = async (): Promise<UserProfile[]> => {
  const response = await api.get<UserProfile[]>('/users');
  return response.data;
};

const updateUserRoles = async (id: string, roles: string[]): Promise<UserProfile> => {
  const response = await api.patch<UserProfile>(`/users/${id}/roles`, roles);
  return response.data;
};

const deleteUserById = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export const userService = {
  // User
  getUserProfile,
  updateUserProfile,
  deleteMyAccount,
  // Admin
  getAllUsers,
  updateUserRoles,
  deleteUserById,
};
