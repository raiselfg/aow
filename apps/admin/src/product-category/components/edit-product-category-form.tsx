import {
  UpdateProductCategorySchema,
  type ProductCategoryWithProducts,
  type UpdateProductCategoryDTO,
} from '@aow/types/product-categories';
import { Button } from '@aow/ui/components/button';
import { Checkbox } from '@aow/ui/components/checkbox';
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
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { categoryQueries } from '@/lib/query-options';

import { productCategories } from '../lib/product-categories';

interface Props {
  category: ProductCategoryWithProducts;
}

export const EditProductCategoryForm = ({ category }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateProductCategoryDTO>({
    resolver: zodResolver(UpdateProductCategorySchema),
    defaultValues: {
      name: category.name,
      is_active: category.is_active,
    },
    mode: 'onSubmit',
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductCategoryDTO) =>
      productCategories.updateCategory(category.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.all });
      setIsOpen(false);
      toast.success('Категория успешно обновлена');
    },
    onError: () => {
      toast.error('Ошибка при обновлении категории');
    },
  });

  const onSubmit = (data: UpdateProductCategoryDTO) => {
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
        <Button variant='outline'>
          <SquarePen /> Редактировать
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>
            Внесите изменения в данные категории. Нажмите сохранить, когда
            закончите.
          </DialogDescription>
        </DialogHeader>
        <form
          id='edit-product-category-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='edit-product-category-name'>
              Название
            </FieldLabel>
            <Input
              id='edit-product-category-name'
              type='text'
              placeholder='Категория 1'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field orientation='horizontal'>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='edit-product-category-is_active'>
                Отображать на сайте
              </FieldLabel>
              <Controller
                control={control}
                name='is_active'
                render={({ field }) => (
                  <Checkbox
                    id='edit-product-category-is_active'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
          </Field>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Отмена</Button>
          </DialogClose>
          <Button
            type='submit'
            form='edit-product-category-form'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
