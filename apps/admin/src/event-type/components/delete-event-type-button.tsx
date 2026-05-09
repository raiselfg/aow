import type { AxiosError } from 'axios';

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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { eventTypeQueries } from '@/lib/query-options';

import { eventTypes } from '../lib/event-type';

interface Props {
  id: string;
  name: string;
}

export const DeleteEventTypeButton = ({ id, name }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventTypes.deleteEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventTypeQueries.all });
      setIsOpen(false);
      toast.success('Тип события успешно удален');
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const message =
        error.response?.data?.message || 'Ошибка при удалении типа события';
      toast.error(message);
    },
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant={'destructive'}
          size={'icon'}
        >
          <Trash2 size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Удаление типа события: {name}</DialogTitle>
          <DialogDescription>
            Это действие необратимо. Тип события будет удален навсегда. Обратите
            внимание, что нельзя удалить тип события, если с ним связаны
            активные заявки.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex items-center justify-between gap-2'>
          <DialogClose asChild>
            <Button variant={'outline'}>Отмена</Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(id)}
          >
            {deleteMutation.isPending && (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            )}
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
