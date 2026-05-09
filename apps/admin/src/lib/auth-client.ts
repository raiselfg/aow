import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_BETTER_AUTH_BASE_URL as string,
});

export const { signIn, signOut, useSession } = authClient;

type ErrorMessages = Partial<
  Record<keyof typeof authClient.$ERROR_CODES, { en: string; ru: string }>
>;
export const errorMessages: ErrorMessages = {
  USER_NOT_FOUND: {
    en: 'User not found',
    ru: 'Пользователь не найден',
  },
  USER_ALREADY_EXISTS: {
    en: 'User already exists',
    ru: 'Пользователь уже зарегистрирован',
  },
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: {
    en: 'User already exists. Use another email',
    ru: 'Пользователь уже существует. Используйте другой email',
  },
  INVALID_EMAIL_OR_PASSWORD: {
    en: 'Invalid email or password',
    ru: 'Неверный email или пароль',
  },
  INVALID_PASSWORD: {
    en: 'Invalid password',
    ru: 'Неверный пароль',
  },
  INVALID_EMAIL: {
    en: 'Invalid email',
    ru: 'Некорректный email',
  },
  EMAIL_NOT_VERIFIED: {
    en: 'Email not verified',
    ru: 'Email не подтверждён',
  },
  EMAIL_ALREADY_VERIFIED: {
    en: 'Email is already verified',
    ru: 'Email уже подтверждён',
  },
  PASSWORD_TOO_SHORT: {
    en: 'Password too short',
    ru: 'Пароль слишком короткий',
  },
  PASSWORD_TOO_LONG: {
    en: 'Password too long',
    ru: 'Пароль слишком длинный',
  },
  SESSION_EXPIRED: {
    en: 'Session expired. Re-authenticate to perform this action',
    ru: 'Сессия истекла. Пожалуйста, войдите снова',
  },
  TOKEN_EXPIRED: {
    en: 'Token expired',
    ru: 'Токен истёк',
  },
  INVALID_TOKEN: {
    en: 'Invalid token',
    ru: 'Неверный токен',
  },
  ACCOUNT_NOT_FOUND: {
    en: 'Account not found',
    ru: 'Аккаунт не найден',
  },
  FAILED_TO_CREATE_USER: {
    en: 'Failed to create user',
    ru: 'Не удалось создать пользователя',
  },
  FAILED_TO_CREATE_SESSION: {
    en: 'Failed to create session',
    ru: 'Не удалось создать сессию',
  },
  CREDENTIAL_ACCOUNT_NOT_FOUND: {
    en: 'Credential account not found',
    ru: 'Учётная запись с паролем не найдена',
  },
  SOCIAL_ACCOUNT_ALREADY_LINKED: {
    en: 'Social account already linked',
    ru: 'Социальный аккаунт уже привязан',
  },
  PROVIDER_NOT_FOUND: {
    en: 'Provider not found',
    ru: 'Провайдер не найден',
  },
  USER_EMAIL_NOT_FOUND: {
    en: 'User email not found',
    ru: 'Email пользователя не найден',
  },
  FAILED_TO_UNLINK_LAST_ACCOUNT: {
    en: "You can't unlink your last account",
    ru: 'Вы не можете отвязать последний аккаунт',
  },
  USER_ALREADY_HAS_PASSWORD: {
    en: 'User already has a password. Provide that to delete the account',
    ru: 'У пользователя уже есть пароль. Укажите его для удаления аккаунта',
  },
  EMAIL_CAN_NOT_BE_UPDATED: {
    en: 'Email can not be updated',
    ru: 'Email нельзя изменить',
  },
  EMAIL_MISMATCH: {
    en: 'Email mismatch',
    ru: 'Email не совпадает',
  },
  SESSION_NOT_FRESH: {
    en: 'Session is not fresh',
    ru: 'Сессия устарела',
  },
  LINKED_ACCOUNT_ALREADY_EXISTS: {
    en: 'Linked account already exists',
    ru: 'Привязанный аккаунт уже существует',
  },
  INVALID_ORIGIN: {
    en: 'Invalid origin',
    ru: 'Недопустимый источник запроса',
  },
  INVALID_CALLBACK_URL: {
    en: 'Invalid callbackURL',
    ru: 'Неверный callback URL',
  },
  CALLBACK_URL_REQUIRED: {
    en: 'callbackURL is required',
    ru: 'Требуется callbackURL',
  },
  VERIFICATION_EMAIL_NOT_ENABLED: {
    en: "Verification email isn't enabled",
    ru: 'Подтверждение email не включено',
  },
  CROSS_SITE_NAVIGATION_LOGIN_BLOCKED: {
    en: 'Cross-site navigation login blocked. This request appears to be a CSRF attack',
    ru: 'Межсайтовая навигация заблокирована. Подозрение на CSRF-атаку',
  },
  FIELD_NOT_ALLOWED: {
    en: 'Field not allowed to be set',
    ru: 'Поле не разрешено для установки',
  },
  VALIDATION_ERROR: {
    en: 'Validation Error',
    ru: 'Ошибка валидации',
  },
  MISSING_FIELD: {
    en: 'Field is required',
    ru: 'Поле обязательно для заполнения',
  },
  PASSWORD_ALREADY_SET: {
    en: 'User already has a password set',
    ru: 'Пароль уже установлен',
  },
};
