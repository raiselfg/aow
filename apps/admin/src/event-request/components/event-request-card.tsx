import {
  statusColors,
  statusLabels,
  type EventRequestWithEventType,
} from '@aow/types/event-requests.js';
import { Badge } from '@aow/ui/components/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@aow/ui/components/card';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';

import { DeleteEventRequestButton } from './delete-event-request-button';
import { EditEventRequestForm } from './edit-event-request-form';

interface Props {
  request: EventRequestWithEventType;
}

export const EventRequestCard = ({ request }: Props) => {
  const startDate = new Date(request.start_date);

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='pb-2'>
        <div className='flex items-start justify-between'>
          <Badge variant={statusColors[request.status] || 'default'}>
            {statusLabels[request.status]}
          </Badge>
          <span className='text-primary text-lg font-bold'>
            {request.budget.toLocaleString()} ₽
          </span>
        </div>
        <CardTitle className='mt-2 line-clamp-1'>{request.name}</CardTitle>
        <Badge
          variant='outline'
          className='w-fit'
        >
          {request.event_type.name}
        </Badge>
      </CardHeader>

      <CardContent className='grow space-y-3 py-2 text-sm'>
        <div className='text-muted-foreground flex items-center gap-2'>
          <Phone size={16} />
          <a
            href={`tel:${request.phone}`}
            className='hover:text-primary transition-colors'
          >
            {request.phone}
          </a>
        </div>

        <div className='text-muted-foreground flex items-center gap-2'>
          <Calendar size={16} />
          <span>
            {startDate.toLocaleString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <div className='text-muted-foreground flex items-center gap-2'>
          <Users size={16} />
          <span>{request.guests} чел.</span>
        </div>

        <div className='text-muted-foreground flex items-start gap-2'>
          <MapPin
            size={16}
            className='mt-0.5 shrink-0'
          />
          <span className='line-clamp-2'>{request.address}</span>
        </div>

        {request.comment && (
          <p className='bg-muted line-clamp-3 rounded p-2 text-xs italic'>
            "{request.comment}"
          </p>
        )}
      </CardContent>

      <CardFooter className='flex justify-end gap-2 border-t pt-2'>
        <EditEventRequestForm request={request} />
        <DeleteEventRequestButton requestId={request.id} />
      </CardFooter>
    </Card>
  );
};
