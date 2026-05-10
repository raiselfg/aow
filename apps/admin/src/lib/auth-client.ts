import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL as string,
});

export const { signIn, signOut, useSession } = authClient;

type ErrorMessages = Partial<
  Record<keyof typeof authClient.$ERROR_CODES, { message: string }>
>;
export const errorMessages: ErrorMessages = {
  USER_NOT_FOUND: {
    message: 'Пользователь не найден',
  },
  USER_ALREADY_EXISTS: {
    message: 'Пользователь уже зарегистрирован',
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    message: 'Пользователь уже существует. Используйте другой email',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    message: 'Неверный email или пароль',
  },
  INVALID_PASSWORD: {
    message: 'Неверный пароль',
  },
  INVALID_EMAIL: {
    message: 'Некорректный email',
  },
  EMAIL_NOT_VERIFIED: {
    message: 'Email не подтверждён',
  },
  EMAIL_ALREADY_VERIFIED: {
    message: 'Email уже подтверждён',
  },
  PASSWORD_TOO_SHORT: {
    message: 'Пароль слишком короткий',
  },
  PASSWORD_TOO_LONG: {
    message: 'Пароль слишком длинный',
  },
  SESSION_EXPIRED: {
    message: 'Сессия истекла. Пожалуйста, войдите снова',
  },
  TOKEN_EXPIRED: {
    message: 'Токен истёк',
  },
  INVALID_TOKEN: {
    message: 'Неверный токен',
  },
  ACCOUNT_NOT_FOUND: {
    message: 'Аккаунт не найден',
  },
  FAILED_TO_CREATE_USER: {
    message: 'Не удалось создать пользователя',
  },
  FAILED_TO_CREATE_SESSION: {
    message: 'Не удалось создать сессию',
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    message: 'Учётная запись с паролем не найдена',
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    message: 'Социальный аккаунт уже привязан',
  },
  PROVIDER_NOT_FOUND: {
    message: 'Провайдер не найден',
  },
  USER_EMAIL_NOT_FOUND: {
    message: 'Email пользователя не найден',
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    message: 'Вы не можете отвязать последний аккаунт',
  },
  USER_ALREADY_HAS_PASSWORD: {
    message:
      'У пользователя уже есть пароль. Укажите его для удаления аккаунта',
  },
  EMAIL_CAN_NOT_BE_UPDATED: {
    message: 'Email нельзя изменить',
  },
  EMAIL_MISMATCH: {
    message: 'Email не совпадает',
  },
  SESSION_NOT_FRESH: {
    message: 'Сессия устарела',
  },
  LINKED_ACCOUNT_ALREADY_EXISTS: {
    message: 'Привязанный аккаунт уже существует',
  },
  INVALID_ORIGIN: {
    message: 'Недопустимый источник запроса',
  },
  INVALID_CALLBACK_URL: {
    message: 'Неверный callback URL',
  },
  CALLBACK_URL_REQUIRED: {
    message: 'Требуется callbackURL',
  },
  VERIFICATION_EMAIL_NOT_ENABLED: {
    message: 'Подтверждение email не включено',
  },
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: {
    message: 'Межсайтовая навигация заблокирована. Подозрение на CSRF-атаку',
  },
  FIELD_NOT_ALLOWED: {
    message: 'Поле не разрешено для установки',
  },
  VALIDATION_ERROR: {
    message: 'Ошибка валидации',
  },
  MISSING_FIELD: {
    message: 'Поле обязательно для заполнения',
  },
  PASSWORD_ALREADY_SET: {
    message: 'Пароль уже установлен',
  },
};
