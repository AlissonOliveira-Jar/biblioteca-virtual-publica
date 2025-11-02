import api from './api';

interface VerifyPasswordPayload {
  password: string;
}

const verifyCurrentUserPassword = async (password: string): Promise<boolean> => {
  try {
    const payload: VerifyPasswordPayload = { password };
    await api.post('/auth/verify-password', payload);
    return true;
  } catch (error) {
    console.error("Erro na verificação de senha via API:", error);
    return false;
  }
};

export const authService = {
  verifyCurrentUserPassword,
};
