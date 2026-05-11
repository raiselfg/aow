import type { EventType } from '@aow/types/event-types';

import { cn } from '@aow/ui/lib/utils';
import { memo } from 'react';

import { DeleteEventTypeButton } from './delete-event-type-button';
import { EditEventTypeForm } from './edit-event-type-form';

interface EventTypeCardProps {
  eventType: EventType;
  className?: string;
}

export const EventTypeCard = memo(
  ({ eventType, className }: EventTypeCardProps) => {
    return (
      <div
        className={cn(
          className,
          'group border-border bg-card hover:border-muted-foreground relative flex flex-col overflow-hidden rounded-lg border transition-all duration-300 hover:shadow-2xl',
        )}
      >
        <div className='flex flex-1 flex-col gap-6 p-6'>
          <h3 className='text-foreground text-xl font-black tracking-tight uppercase italic transition-transform group-hover:translate-x-0.5'>
            {eventType.name}
          </h3>

          <div className='flex items-center justify-between border-t pt-6'>
            <EditEventTypeForm eventType={eventType} />
            <DeleteEventTypeButton
              id={eventType.id}
              name={eventType.name}
            />
          </div>
        </div>
      </div>
    );
  },
);
