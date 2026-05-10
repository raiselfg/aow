import {
  UpdateEventRequestSchema,
  RequestStatusEnum,
  type EventRequestWithEventType,
  type UpdateEventRequestDTO,
  statusLabels,
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
import { Loader2, SquarePen } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { DateTimePicker } from '@/components/date-time-picker';
import { eventRequestQueries, eventTypeOptions } from '@/lib/query-options';

import { eventRequests } from '../lib/event-request';

interface Props {
  request: EventRequestWithEventType;
}

export const EditEventRequestForm = ({ request }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: eventTypes } = useQuery(eventTypeOptions.list());

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<UpdateEventRequestDTO>({
    resolver: zodResolver(UpdateEventRequestSchema),
    defaultValues: {
      name: request.name,
      phone: request.phone,
      event_type_id: request.event_type_id,
      start_date: new Date(request.start_date),
      end_date: new Date(request.end_date),
      guests: request.guests,
      budget: request.budget,
      status: request.status,
      address: request.address,
      comment: request.comment || '',
    },
    mode: 'onSubmit',
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateEventRequestDTO) =>
      eventRequests.updateEventRequest(request.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: eventRequestQueries.all });
      setIsOpen(false);
      toast.success('Заявка успешно обновлена');
    },
    onError: () => toast.error('Ошибка при обновлении заявки'),
  });

  const handleClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = (data: UpdateEventRequestDTO) => {
    updateMutation.mutate(data);
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
        <Button
          variant='outline'
          size='sm'
        >
          <SquarePen className='mr-2 h-4 w-4' /> Редактировать
        </Button>
      </DialogTrigger>

      <DialogContent className='max-h-[90vh] overflow-y-auto sm:max-w-xl'>
        <DialogHeader>
          <DialogTitle>Редактирование заявки</DialogTitle>
          <DialogDescription>
            Внесите изменения в данные заявки.
          </DialogDescription>
        </DialogHeader>

        <form
          id='edit-event-request-form'
          onSubmit={handleSubmit(onSubmit)}
          className='space-y-4 py-4'
        >
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Field>
              <FieldLabel htmlFor='edit-request-name'>Имя клиента</FieldLabel>
              <Input
                id='edit-request-name'
                type='text'
                required
                {...register('name')}
              />
              {errors.name && <FieldError errors={[errors.name]} />}
            </Field>

            <Field>
              <FieldLabel htmlFor='edit-request-phone'>Телефон</FieldLabel>
              <Controller
                control={control}
                name='phone'
                render={({ field }) => (
                  <Input
                    {...field}
                    id='edit-request-phone'
                    type='tel'
                    required
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
            <FieldLabel htmlFor='edit-request-event_type_id'>
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
                  <SelectTrigger id='edit-request-event_type_id'>
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
              <FieldLabel htmlFor='edit-start-date-time-picker'>
                Дата и время начала
              </FieldLabel>
              <Controller
                control={control}
                name='start_date'
                render={({ field }) => (
                  <DateTimePicker
                    id='edit-start-date-time-picker'
                    date={field.value}
                    setDate={field.onChange}
                    timeLabel='Время начала события'
                  />
                )}
              />
              {errors.start_date && <FieldError errors={[errors.start_date]} />}
            </Field>

            <Field>
              <FieldLabel htmlFor='edit-end-date-time-picker'>
                Дата и время окончания
              </FieldLabel>
              <Controller
                control={control}
                name='end_date'
                render={({ field }) => (
                  <DateTimePicker
                    id='edit-end-date-time-picker'
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
              <FieldLabel htmlFor='edit-request-guests'>
                Количество гостей
              </FieldLabel>
              <Input
                id='edit-request-guests'
                type='number'
                required
                {...register('guests', { valueAsNumber: true })}
              />
              {errors.guests && <FieldError errors={[errors.guests]} />}
            </Field>

            <Field>
              <FieldLabel htmlFor='edit-request-budget'>Бюджет (₽)</FieldLabel>
              <Input
                id='edit-request-budget'
                type='number'
                required
                {...register('budget', { valueAsNumber: true })}
              />
              {errors.budget && <FieldError errors={[errors.budget]} />}
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='edit-request-status'>Статус</FieldLabel>
            <Controller
              control={control}
              name='status'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <SelectTrigger id='edit-request-status'>
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
            <FieldLabel htmlFor='edit-request-address'>
              Адрес мероприятия
            </FieldLabel>
            <Input
              id='edit-request-address'
              type='text'
              required
              {...register('address')}
            />
            {errors.address && <FieldError errors={[errors.address]} />}
          </Field>

          <Field>
            <FieldLabel htmlFor='edit-request-comment'>Комментарий</FieldLabel>
            <Input
              id='edit-request-comment'
              type='text'
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
            form='edit-event-request-form'
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
