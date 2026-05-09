import {
  UpdateEventTypeSchema,
  type EventType,
  type UpdateEventTypeDTO,
} from '@aow/types/event-requests.js';
import { Button } from '@aow/ui/components/button';
import {
  Dialog,
  DialogClose,
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
import { SquarePen, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { eventTypeQueries } from '@/lib/query-options';

import { eventTypes } from '../lib/event-type';

interface Props {
  eventType: EventType;
}

export const EditEventTypeForm = ({ eventType }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateEventTypeDTO>({
    resolver: zodResolver(UpdateEventTypeSchema),
    defaultValues: {
      name: eventType.name,
    },
    mode: 'onSubmit',
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateEventTypeDTO) =>
      eventTypes.updateEventType(eventType.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventTypeQueries.all });
      setIsOpen(false);
      toast.success('Тип события успешно обновлен');
    },
    onError: () => {
      toast.error('Ошибка при обновлении типа события');
    },
  });

  const onSubmit = (data: UpdateEventTypeDTO) => {
    updateMutation.mutate(data);
  };

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      reset();
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          size='sm'
        >
          <SquarePen className='mr-2 h-4 w-4' /> Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Редактировать тип события</DialogTitle>
          <DialogDescription>
            Внесите изменения в название типа события.
          </DialogDescription>
        </DialogHeader>
        <form
          id='edit-event-type-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='edit-event-type-name'>Название</FieldLabel>
            <Input
              id='edit-event-type-name'
              type='text'
              placeholder='Свадьба'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Отмена</Button>
          </DialogClose>
          <Button
            type='submit'
            form='edit-event-type-form'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
