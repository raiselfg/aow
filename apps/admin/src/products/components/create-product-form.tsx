import {
  CreateProductFormSchema,
  type CreateProductFormDTO,
} from '@aow/types/products';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@aow/ui/components/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { categoryOptions, productQueries } from '@/lib/query-options';
import { products } from '@/products/lib/products';

export const CreateProductForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: categories } = useQuery(categoryOptions.list());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateProductFormDTO>({
    resolver: zodResolver(CreateProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      is_active: true,
      product_category_id: '',
      file: undefined,
    },
    mode: 'onSubmit',
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setValue('file', file, { shouldValidate: true });
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
      }
    },
    [setValue],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif'] },
      maxFiles: 1,
      maxSize: 2 * 1024 * 1024, //2mb
      multiple: false,
    });

  const getErrorMessage = () => {
    if (errors.file) return errors.file.message;

    if (fileRejections.length > 0) {
      const error = fileRejections[0].errors[0];
      switch (error.code) {
        case 'file-invalid-type':
          return 'Недопустимый формат файла. Используйте изображения.';
        case 'file-too-large':
          return 'Файл слишком большой. Максимум 2МБ.';
        case 'too-many-files':
          return 'Можно загрузить только один файл.';
        default:
          return error.message;
      }
    }

    return null;
  };

  const errorMessage = getErrorMessage();

  const createMutation = useMutation({
    mutationFn: async (data: CreateProductFormDTO) => {
      const imageUrl = await products.uploadImage(data.file);

      if (!imageUrl) {
        toast.error('Не удалось загрузить изображение');
        throw new Error('Не удалось загрузить изображение');
      }

      return products.createProduct({
        name: data.name,
        description: data.description,
        is_active: data.is_active,
        product_category_id: data.product_category_id,
        image: imageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueries.all });
      handleClose();
      toast.success('Товар успешно создан');
    },
    onError: () => toast.error('Ошибка при создании товара'),
  });

  const resetPreview = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    reset();
    resetPreview();
  };

  const onSubmit = (data: CreateProductFormDTO) => createMutation.mutate(data);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={val => (!val ? handleClose() : setIsOpen(true))}
    >
      <DialogTrigger asChild>
        <Button>Создать товар</Button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-110'>
        <DialogHeader>
          <DialogTitle>Новый товар</DialogTitle>
          <DialogDescription>
            Добавьте новый товар заполнив форму.
          </DialogDescription>
        </DialogHeader>

        <form
          id='create-product-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-5 py-4'
        >
          <Field>
            <FieldLabel htmlFor='create-product-name'>Название</FieldLabel>
            <Input
              id='create-product-name'
              type='text'
              placeholder='Товар 1'
              required
              {...register('name')}
            />
            {errors.name && <FieldError errors={[errors.name]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor='create-product-description'>
              Описание
            </FieldLabel>
            <Input
              id='create-product-description'
              type='text'
              placeholder='Описание товара 1'
              {...register('description')}
            />
          </Field>

          <Field>
            <FieldLabel>Фото товара</FieldLabel>

            <div
              {...getRootProps()}
              className={`relative flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-all ${isDragActive ? 'border-primary bg-primary/5' : ''}`}
            >
              <input {...getInputProps()} />

              {preview ? (
                <div className='group relative'>
                  <img
                    src={preview}
                    alt='Preview'
                    className='max-h-32 rounded-lg object-contain shadow-sm'
                  />
                  <div className='absolute inset-0 flex items-center justify-center rounded-lg'>
                    <Button>Заменить фото</Button>
                  </div>
                </div>
              ) : (
                <div className='text-center'>
                  <Upload className='mx-auto mb-2' />
                  <p className='text-xs font-medium'>
                    Перетащите фото сюда или нажмите для добавления фото
                  </p>
                  <p className='mt-1 text-xs opacity-40'>
                    Поддерживается PNG, JPG, WEBP, AVIF до 2MB
                  </p>
                </div>
              )}
            </div>

            {errorMessage && <FieldError>{errorMessage}</FieldError>}

            {preview && !createMutation.isPending && (
              <Button
                variant='destructive'
                size='sm'
                type='button'
                onClick={e => {
                  e.stopPropagation();
                  resetPreview();
                }}
              >
                Удалить изображение
              </Button>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor='create-product-category-product_category_id'>
              Категория
            </FieldLabel>
            <Controller
              control={control}
              name='product_category_id'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id='create-product-category-product_category_id'>
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

          <Field>
            <div className='flex items-center gap-2'>
              <FieldLabel htmlFor='create-product-is_active'>
                Отображать на сайте
              </FieldLabel>
              <Controller
                control={control}
                name='is_active'
                render={({ field }) => (
                  <Checkbox
                    id='create-product-is_active'
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
            form='create-product-form'
            disabled={createMutation.isPending}
          >
            {createMutation.isPending && (
              <Loader2
                size={16}
                className='animate-spin'
              />
            )}
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
