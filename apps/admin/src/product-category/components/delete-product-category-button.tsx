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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Trash2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { categoryQueries } from '@/lib/query-options';

import { productCategories } from '../lib/product-categories';

interface Props {
  categoryId: string;
}

export const DeleteProductCategoryButton = ({ categoryId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: category, isLoading } = useQuery({
    queryKey: categoryQueries.detail(categoryId),
    queryFn: () => productCategories.getCategoryById(categoryId),
    enabled: isOpen,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productCategories.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.all });
      setIsOpen(false);
      toast.success('Категория успешно удалена');
    },
    onError: () => {
      toast.error('Ошибка при удалении категории');
    },
  });

  const hasProducts = category?.product && category.product.length > 0;
  const isAllowedToDelete = !isLoading && !hasProducts;

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
          <DialogTitle>Удаление категории</DialogTitle>
          <DialogDescription>
            {hasProducts
              ? 'Нельзя удалить категорию, в которой есть товары. Сначала удалите товары из этой категории или переместите товары в другую категорию.'
              : 'Это действие необратимо. Категория будет удалена навсегда.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className='flex justify-center py-4'>
            <Loader2 className='animate-spin opacity-50' />
          </div>
        )}

        <DialogFooter className='flex items-center justify-between gap-2'>
          <DialogClose asChild>
            <Button variant={'outline'}>Отмена</Button>
          </DialogClose>
          {hasProducts ? (
            <Link to='/dashboard/products'>
              <Button className='cursor-pointer'>Перейти к товарам</Button>
            </Link>
          ) : (
            <Button
              variant={'destructive'}
              disabled={!isAllowedToDelete || deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(categoryId)}
            >
              {deleteMutation.isPending && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Удалить
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
