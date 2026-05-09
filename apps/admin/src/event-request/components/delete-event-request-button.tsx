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
import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { eventRequestQueries } from '@/lib/query-options';

import { eventRequests } from '../lib/event-request';

interface Props {
  requestId: string;
}

export const DeleteEventRequestButton = ({ requestId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => eventRequests.deleteEventRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventRequestQueries.all });
      setIsOpen(false);
      toast.success('Заявка успешно удалена');
    },
    onError: () => {
      toast.error('Ошибка при удалении заявки');
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
          <DialogTitle>Удаление заявки</DialogTitle>
          <DialogDescription>
            Это действие необратимо. Заявка будет удалена навсегда.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className='flex items-center justify-between gap-2'>
          <DialogClose asChild>
            <Button variant={'outline'}>Отмена</Button>
          </DialogClose>
          <Button
            variant={'destructive'}
            disabled={deleteMutation.isPending}
            onClick={() => deleteMutation.mutate(requestId)}
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
