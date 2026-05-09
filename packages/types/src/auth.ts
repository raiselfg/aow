import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.email('Введите корректный email'),
  password: z.string().min(6, 'Введите пароль длиной не менее 6 символов'),
});

export type SignInSchemaType = z.infer<typeof SignInSchema>;
