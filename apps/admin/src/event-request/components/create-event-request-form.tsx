import {
  CreateEventRequestSchema,
  RequestStatusEnum,
  statusLabels,
  type CreateEventRequestDTO,
} from '@aow/types/event-requests';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@aow/ui/components/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DateTimePicker } from '@/components/date-time-picker';
import { eventRequestQueries, eventTypeOptions } from '@/lib/query-options';

import { eventRequests } from '../lib/event-request';

export const CreateEventRequestForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: eventTypes } = useQuery(eventTypeOptions.list());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<CreateEventRequestDTO>({
    resolver: zodResolver(CreateEventRequestSchema),
    defaultValues: {
      name: '',
      phone: '+7',
      event_type_id: '',
      start_date: new Date(),
      end_date: new Date(),
      guests: 0,
      budget: 0,
      status: 'unconfirmed',
      address: '',
      comment: '',
    },
    mode: 'onSubmit',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateEventRequestDTO) =>
      eventRequests.createEventRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventRequestQueries.all });
      handleClose();
      toast.success('Заявка успешно создана');
    },
    onError: () => toast.error('Ошибка при создании заявки'),
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: CreateEventRequestDTO) => {
    createMutation.mutate(data);
  };

  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const cleanDigits =
      digits.startsWith('7') || digits.startsWith('8')
        ? digits.slice(1)
        : digits;
    const part = cleanDigits.slice(0, 10);

    let res = '+7';
    if (part.length > 0) res += '-' + part.slice(0, 3);
    if (part.length > 3) res += '-' + part.slice(3, 6);
    if (part.length > 6) res += '-' + part.slice(6, 8);
    if (part.length > 8) res += '-' + part.slice(8, 10);

    return res;
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={val => (!val ? handleClose() : setIsOpen(true))}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className='mr-2 h-4 w-4' /> Создать заявку
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Новая заявка</DialogTitle>
          <DialogDescription>
            Заполните данные о новом мероприятии.
          </DialogDescription>
        </DialogHeader>

        <form
          id='create-event-request-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 py-4'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='create-request-name'>Имя клиента</FieldLabel>
              <Input
                id='create-request-name'
                type='text'
                placeholder='Иван Иванов'
                {...register('name')}
              />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            <Field>
              <FieldLabel htmlFor='create-request-phone'>Телефон</FieldLabel>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <Input
                    {...field}
                    id='create-request-phone'
                    type='tel'
                    placeholder='+7-999-000-00-00'
                    onChange={e => {
                      field.onChange(formatPhone(e.target.value));
                    }}
                  />
                )}
              />
              {errors.phone && <FieldError errors={[errors.phone]} />}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='create-request-event_type_id'>
              Тип события
            </FieldLabel>
            <Controller
              control={control}
              name='event_type_id'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id='create-request-event_type_id'>
                    <SelectValue placeholder='Выберите тип события' />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes?.map(type => (
                      <SelectItem
                        key={type.id}
                        value={type.id}
                      >
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.event_type_id && (
              <FieldError errors={[errors.event_type_id]} />
            )}
          </Field>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='create-start-date-time-picker'>
                Дата и время начала
              </FieldLabel>
              <Controller
                control={control}
                name='start_date'
                render={({ field }) => (
                  <DateTimePicker
                    id='create-start-date-time-picker'
                    date={field.value}
                    setDate={field.onChange}
                    timeLabel='Время начала события'
                  />
                )}
              />
              {errors.start_date && <FieldError errors={[errors.start_date]} />}
            </Field>

            <Field>
              <FieldLabel htmlFor='create-end-date-time-picker'>
                Дата и время окончания
              </FieldLabel>
              <Controller
                control={control}
                name='end_date'
                render={({ field }) => (
                  <DateTimePicker
                    id='create-end-date-time-picker'
                    date={field.value}
                    setDate={field.onChange}
                    timeLabel='Время конца события'
                  />
                )}
              />
              {errors.end_date && <FieldError errors={[errors.end_date]} />}
            </Field>
          </div>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='create-request-guests'>
                Количество гостей
              </FieldLabel>
              <Input
                id='create-request-guests'
                type='number'
                {...register('guests', { valueAsNumber: true })}
              />
              {errors.guests && <FieldError errors={[errors.guests]} />}
            </Field>

            <Field>
              <FieldLabel htmlFor='create-request-budget'>
                Бюджет (₽)
              </FieldLabel>
              <Input
                id='create-request-budget'
                type='number'
                {...register('budget', { valueAsNumber: true })}
              />
              {errors.budget && <FieldError errors={[errors.budget]} />}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='create-request-status'>Статус</FieldLabel>
            <Controller
              control={control}
              name='status'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id='create-request-status'>
                    <SelectValue placeholder='Выберите статус' />
                  </SelectTrigger>
                  <SelectContent>
                    {RequestStatusEnum.options.map(status => (
                      <SelectItem
                        key={status}
                        value={status}
                      >
                        {statusLabels[status]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.status && <FieldError errors={[errors.status]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor='create-request-address'>
              Адрес мероприятия
            </FieldLabel>
            <Input
              id='create-request-address'
              type='text'
              placeholder='г. Москва, ул. Ленина, д. 1'
              {...register('address')}
            />
            {errors.address && <FieldError errors={[errors.address]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor='create-request-comment'>
              Комментарий
            </FieldLabel>
            <Input
              id='create-request-comment'
              type='text'
              placeholder='Дополнительные детали...'
              {...register('comment')}
            />
            {errors.comment && <FieldError errors={[errors.comment]} />}
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
            form='create-event-request-form'
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
