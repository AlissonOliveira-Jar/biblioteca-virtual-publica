/* Adiciona a coluna google_drive_file_id na tabela tb_livros
para armazenar o ID do arquivo correspondente no Google Drive.
*/
ALTER TABLE public.tb_livros
ADD COLUMN google_drive_file_id VARCHAR(255) NULL;