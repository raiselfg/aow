import { Button } from '@aow/ui/components/button';
import { Calendar } from '@aow/ui/components/calendar';
import { Input } from '@aow/ui/components/input';
import { Label } from '@aow/ui/components/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@aow/ui/components/popover';
import { cn } from '@aow/ui/lib/utils';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

interface DateTimePickerProps extends React.HTMLAttributes<HTMLButtonElement> {
  date?: Date;
  // eslint-disable-next-line no-unused-vars
  setDate: (value: Date) => void;
  label?: string;
  timeLabel: string;
}

export function DateTimePicker({
  date,
  setDate,
  label,
  timeLabel,
  ...props
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date,
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;

    const updatedDate = new Date(newDate);
    if (selectedDate) {
      updatedDate.setHours(selectedDate.getHours());
      updatedDate.setMinutes(selectedDate.getMinutes());
    }
    setSelectedDate(updatedDate);
    setDate(updatedDate);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = e.target.value;
    if (!time || !selectedDate) return;

    const [hours, minutes] = time.split(':').map(Number);
    const updatedDate = new Date(selectedDate);
    updatedDate.setHours(hours);
    updatedDate.setMinutes(minutes);

    setSelectedDate(updatedDate);
    setDate(updatedDate);
  };

  return (
    <div className='flex flex-col gap-2'>
      {label && <Label>{label}</Label>}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            {...props}
            type='button'
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? (
              format(date, 'PPP HH:mm', { locale: ru })
            ) : (
              <span>Выберите дату и время</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className='w-auto p-0'
          align='start'
        >
          <Calendar
            mode='single'
            selected={selectedDate}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className='flex flex-col gap-2 border-t p-3'>
            <Label htmlFor='date-time-picker-input'>{timeLabel}</Label>

            <Input
              id='date-time-picker-input'
              type='time'
              className='h-8 w-full'
              value={selectedDate ? format(selectedDate, 'HH:mm') : ''}
              onChange={handleTimeChange}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
