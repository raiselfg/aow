import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  UpdateProductBodySchema,
  type ProductWithProductCategory,
  type UpdateProductDTO,
} from '@aow/types/products';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@aow/ui/components/select';
import { SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { categoryOptions, productQueries } from '@/lib/query-options';
import { products } from '@/products/lib/products';

interface Props {
  product: ProductWithProductCategory;
}

export const EditProductForm = ({ product }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery(categoryOptions.list());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateProductDTO>({
    resolver: zodResolver(UpdateProductBodySchema),
    defaultValues: {
      name: product.name,
      description: product.description,
      is_active: product.is_active,
      product_category_id: product.product_category_id,
    },
    mode: 'all',
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateProductDTO) =>
      products.updateProduct(product.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueries.all });
      setIsOpen(false);
      toast.success('Товар успешно обновлен');
    },
    onError: () => {
      toast.error('Ошибка при обновлении товара');
    },
  });

  const onSubmit = (data: UpdateProductDTO) => {
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
          <DialogTitle>Редактировать товар</DialogTitle>
          <DialogDescription>
            Внесите изменения в данные товара. Нажмите сохранить, когда
            закончите.
          </DialogDescription>
        </DialogHeader>
        <form
          id='edit-product-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='edit-product-name'>Название</FieldLabel>
            <Input
              id='edit-product-name'
              type='text'
              placeholder='Товар 1'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor='edit-product-description'>Описание</FieldLabel>
            <Input
              id='edit-product-description'
              type='text'
              placeholder='Описание товара 1'
              {...register('description')}
            />
            {errors.description && <FieldError errors={[errors.description]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor='edit-product-product_category_id'>
              Категория
            </FieldLabel>
            <Controller
              control={control}
              name='product_category_id'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger id='edit-product-product_category_id'>
                    <SelectValue placeholder='Выберите категорию' />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map(category => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.product_category_id && (
              <FieldError errors={[errors.product_category_id]} />
            )}
          </Field>

          <Field orientation='horizontal'>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='edit-product-is_active'>
                Отображать на сайте
              </FieldLabel>
              <Controller
                control={control}
                name='is_active'
                render={({ field }) => (
                  <Checkbox
                    id='edit-product-is_active-is_active'
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
            form='edit-product-form'
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
