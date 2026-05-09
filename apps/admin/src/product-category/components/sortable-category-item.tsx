import { type ProductCategoryWithProducts } from '@aow/types/product-categories';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

import { ProductCategoryCard } from './product-category-card';

interface Props {
  category: ProductCategoryWithProducts;
}

export function SortableCategoryItem({ category }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group relative'
    >
      <div
        {...attributes}
        {...listeners}
        className='bg-background/50 hover:bg-background/80 absolute top-2 right-2 z-1 cursor-grab rounded-md p-2 opacity-100 transition-opacity active:cursor-grabbing'
      >
        <GripVertical />
      </div>

      <ProductCategoryCard category={category} />
    </div>
  );
}
