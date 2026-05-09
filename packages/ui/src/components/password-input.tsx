import { type ComponentProps, useState } from 'react';
import { Input } from './input';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../lib/utils';

export const PasswordInput = ({
  className,
  ...props
}: ComponentProps<'input'>) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(prev => !prev);

  return (
    <div className='relative w-full'>
      <Input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={cn('pr-10', className)}
      />
      <button
        type='button'
        onClick={toggleVisibility}
        className='absolute top-1/2 right-3 -translate-y-1/2'
        aria-label={isVisible ? 'Скрыть пароль' : 'Показать пароль'}
      >
        {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );
};
