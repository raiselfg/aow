import { type ProductCategoryWithProducts } from '@aow/types';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { categoryQueries } from '@/lib/query-options';

import { productCategories } from '../lib/product-categories';
import { SortableCategoryItem } from './sortable-category-item';

interface Props {
  initialCategories: ProductCategoryWithProducts[];
}

export function CategorySortableList({ initialCategories }: Props) {
  const [items, setItems] = useState(initialCategories);
  const [prevInitial, setPrevInitial] = useState(initialCategories);

  const queryClient = useQueryClient();

  if (initialCategories !== prevInitial) {
    setItems(initialCategories);
    setPrevInitial(initialCategories);
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const reorderMutation = useMutation({
    mutationFn: (categoryIds: string[]) =>
      productCategories.reorderCategories(categoryIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryQueries.all });
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);

        reorderMutation.mutate(newItems.map(item => item.id));
        return newItems;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3'>
          {items.map((category, index) => (
            <div
              key={category.id}
              className='animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-700'
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <SortableCategoryItem category={category} />
            </div>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
