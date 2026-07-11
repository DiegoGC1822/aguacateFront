import { AppError } from '../errors';

export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png'] as const;

export const validateImageFormatUseCase = (uri: string): void => {
  const filename = uri.split('?')[0].split('/').pop() ?? '';
  const ext = filename.split('.').pop()?.toLowerCase() ?? '';

  if (!ALLOWED_EXTENSIONS.includes(ext as any)) {
    throw new AppError(
      'IMAGE_FORMAT',
      `Formato no soportado: ".${ext || 'desconocido'}". Solo se permiten imágenes JPG o PNG.`,
    );
  }
};
