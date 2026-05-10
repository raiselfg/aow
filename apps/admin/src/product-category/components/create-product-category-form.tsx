import {
  CreateProductCategorySchema,
  type CreateProductCategoryDTO,
} from '@aow/types/product-categories';
import { Button } from '@aow/ui/components/button';
import { Checkbox } from '@aow/ui/components/checkbox';
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
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { categoryQueries } from '@/lib/query-options';

import { productCategories } from '../lib/product-categories';

export const CreateProductCategoryForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateProductCategoryDTO>({
    resolver: zodResolver(CreateProductCategorySchema),
    defaultValues: {
      name: '',
      is_active: true,
    },
    mode: 'onSubmit',
  });

  const createMutation = useMutation({
    mutationFn: async (data: CreateProductCategoryDTO) => {
      return productCategories.createCategory({
        name: data.name,
        is_active: data.is_active,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.all });
      handleClose();
      toast.success('Категория успешно создана');
    },
    onError: () => toast.error('Ошибка при создании категории'),
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: CreateProductCategoryDTO) =>
    createMutation.mutate(data);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={val => (!val ? handleClose() : setIsOpen(true))}
    >
      <DialogTrigger asChild>
        <Button>Создать категорию</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Новая категория</DialogTitle>
          <DialogDescription>
            Добавьте новую категорию заполнив форму.
          </DialogDescription>
        </DialogHeader>

        <form
          id='create-product-category-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='create-product-category-name'>
              Название
            </FieldLabel>
            <Input
              id='create-product-category-name'
              type='text'
              placeholder='Категория 1'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='create-product-category-is_active'>
                Отображать на сайте
              </FieldLabel>
              <Controller
                control={control}
                name='is_active'
                render={({ field }) => (
                  <Checkbox
                    id='create-product-category-is_active'
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
            </div>
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
            form='create-product-category-form'
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
