import {
  CreateEventTypeSchema,
  type CreateEventTypeDTO,
} from '@aow/types/event-requests.js';
import { Button } from '@aow/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@aow/ui/components/dialog';
import { Field, FieldError, FieldLabel } from '@aow/ui/components/field';
import { Input } from '@aow/ui/components/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { eventTypeQueries } from '@/lib/query-options';

import { eventTypes } from '../lib/event-type';

export const CreateEventTypeForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateEventTypeDTO>({
    resolver: zodResolver(CreateEventTypeSchema),
    defaultValues: {
      name: '',
    },
    mode: 'onSubmit',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEventTypeDTO) => eventTypes.createEventType(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventTypeQueries.all });
      handleClose();
      toast.success('Тип события успешно создан');
    },
    onError: () => toast.error('Ошибка при создании типа события'),
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: CreateEventTypeDTO) => createMutation.mutate(data);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={val => (!val ? handleClose() : setIsOpen(true))}
    >
      <DialogTrigger asChild>
        <Button>Создать тип</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Новый тип события</DialogTitle>
          <DialogDescription>
            Добавьте новый тип события, например "Свадьба" или "Юбилей".
          </DialogDescription>
        </DialogHeader>

        <form
          id='create-event-type-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='create-event-type-name'>Название</FieldLabel>
            <Input
              id='create-event-type-name'
              type='text'
              placeholder='Свадьба'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>
        </form>

        <DialogFooter>
          <Button
            variant='ghost'
            onClick={handleClose}
          >
            Отмена
          </Button>
          <Button
            type='submit'
            form='create-event-type-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
