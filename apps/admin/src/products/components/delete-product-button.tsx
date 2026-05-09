import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { productQueries } from '@/lib/query-options';
import { products } from '@/products/lib/products';

interface Props {
  productId: string;
}

export const DeleteProductButton = ({ productId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => products.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueries.all });
      setIsOpen(false);
      toast.success('Товар успешно удален');
    },
    onError: () => toast.error('Ошибка при удалении товара'),
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
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Вы уверены что хотите удалить этот товар?</DialogTitle>
          <DialogDescription>
            Это действие необратимо. Оно приведет к безвозвратному удалению
            данного продукта и данных с сервера.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex items-center justify-between'>
          <DialogClose>
            <Button variant={'outline'}>Отмена</Button>
          </DialogClose>

          <Button
            variant={'destructive'}
            onClick={() => deleteMutation.mutate(productId)}
          >
            Удалить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
