export type AppErrorType =
  | 'VALIDATION'    // campo vacío, formato inválido, contraseña débil
  | 'AUTH'          // credenciales inválidas, usuario no encontrado, sesión expirada
  | 'NETWORK'       // sin conexión, timeout
  | 'SERVER'        // error 5xx
  | 'IMAGE_FORMAT'; // formato de imagen no soportado

export class AppError extends Error {
  public readonly type: AppErrorType;

  constructor(type: AppErrorType, message: string) {
    super(message);
    this.name = 'AppError';
    this.type = type;
  }
}

export const APP_ERROR_TITLES: Record<AppErrorType, string> = {
  VALIDATION: 'Datos inválidos',
  AUTH: 'Error de autenticación',
  NETWORK: 'Sin conexión',
  SERVER: 'Error del servidor',
  IMAGE_FORMAT: 'Formato no soportado',
};

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
