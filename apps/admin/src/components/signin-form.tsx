import { SignInSchema, type SignInSchemaType } from '@aow/types';
import { Button } from '@aow/ui/components/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@aow/ui/components/field';
import { Input } from '@aow/ui/components/input';
import { PasswordInput } from '@aow/ui/components/password-input';
import { Spinner } from '@aow/ui/components/spinner';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { errorMessages, signUp } from '@/lib/auth-client';

export const SignInForm = () => {
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  async function onSubmit(data: SignInSchemaType) {
    const { error } = await signUp.email({
      name: 'Админ',
      email: data.email,
      password: data.password,
      // rememberMe: true,
      // callbackURL: '/dashboard',
    });

    if (error) {
      const errorCode = error.code as keyof typeof errorMessages;
      const message =
        (error.code && errorMessages[errorCode]?.ru) || error.message;
      toast.error(message);
    } else {
      toast.success('Вы успешно вошли в систему');
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className='w-full max-w-sm'
      id='auth-form'
    >
      <FieldGroup className='flex flex-col gap-2'>
        <Controller
          name='email'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='email'>Почта</FieldLabel>
              <Input
                {...field}
                id='email'
                type='email'
                aria-invalid={fieldState.invalid}
                placeholder='example@mail.ru'
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name='password'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='password'>Пароль</FieldLabel>
              <PasswordInput
                {...field}
                id='password'
                aria-invalid={fieldState.invalid}
                placeholder='******'
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button
          type='submit'
          id='auth-form'
          className='w-full'
          disabled={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting ? (
            <span>Войти</span>
          ) : (
            <div className='flex items-center gap-2'>
              <Spinner />
              <span>Вход...</span>
            </div>
          )}
        </Button>
      </FieldGroup>
    </form>
  );
};
