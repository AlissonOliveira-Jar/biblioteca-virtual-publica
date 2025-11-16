import api from './api';

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
}

export const getDriveFiles = async (): Promise<DriveFile[]> => {
  try {
    const response = await api.get<DriveFile[]>('/drive/livros');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar arquivos do Drive:", error);
    throw error;
  }
};

export const driveService = {
  getDriveFiles,
};
