export const productTypes = [
  {
    id: '8f9ab0f7-de94-4fb1-b58a-19695cc13d98',
    name: 'Оформление и декор',
    order: 1,
  },
  {
    id: 'c39610c5-942f-4ab2-897a-b0761874a0bc',
    name: 'Техническое оборудование',
    order: 2,
  },
  {
    id: '3f9c13e5-ca39-40a1-b2b6-3fb78d4fecc3',
    name: 'Шоу-программы и услуги',
    order: 3,
  },
];

export const products = [
  // Техническое оборудование (вместо блузок)
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/0045d283-205d-4a58-9cc2-f2cef1762389.avif',
    product_category_id: productTypes[1].id,
    name: 'Комплект звука (до 100 чел.)',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/5baa5764-9098-4edb-9e39-4f0a87eb7f82.avif',
    product_category_id: productTypes[1].id,
    name: 'Светомузыкальная установка',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/e8aab48a-d48a-42bb-bab6-5fcaaff5c11c.avif',
    product_category_id: productTypes[1].id,
    name: 'Генератор тяжелого дыма',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/7356f9fd-bffd-431e-bf05-2a4b6413f5df.avif',
    product_category_id: productTypes[1].id,
    name: 'Архитектурная подсветка зала',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/a98bd84c-22d4-4f1e-b7e3-64b6cd170ab4.avif',
    product_category_id: productTypes[1].id,
    name: 'Плазменная панель на стойке',
  },

  // Шоу-программы и услуги (вместо шапок)
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/46f33fa4-0491-4f2f-98a8-543ab144c115.avif',
    product_category_id: productTypes[2].id,
    name: 'Пирамида из шампанского',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/199220b2-3eb8-46c3-b959-2f8769724120.avif',
    product_category_id: productTypes[2].id,
    name: 'Бармен-шоу',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/3659f1ea-ab3a-4380-b100-ed1eb15a70f2.avif',
    product_category_id: productTypes[2].id,
    name: 'Иллюзионное шоу',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/e53621b7-15ad-4eb6-975d-4102243de26f.avif',
    product_category_id: productTypes[2].id,
    name: 'Огненное шоу',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/b0abc2e5-8ac2-458d-95c1-3d7c805e6d1e.avif',
    product_category_id: productTypes[2].id,
    name: 'Аниматоры для детской зоны',
  },

  // Оформление и декор (вместо одежды)
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/01272619-b96e-45f5-afd1-8e503aa435fe.avif',
    product_category_id: productTypes[0].id,
    name: 'Фотозона с пайетками',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/9b6e483d-35c4-4bd3-a73f-7bf6ae72f3cf.avif',
    product_category_id: productTypes[0].id,
    name: 'Свадебная арка с флористикой',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/3b34558f-90f1-4d11-a437-f16f8315cda3.avif',
    product_category_id: productTypes[0].id,
    name: 'Композиция на стол молодоженов',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/cba8ca18-d743-4674-bf40-eb7f3eced309.avif',
    product_category_id: productTypes[0].id,
    name: 'Декор гостевых столов (композиции)',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/41c7899f-46c1-49cb-8e1f-a26377c9876f.avif',
    product_category_id: productTypes[0].id,
    name: 'Неоновая вывеска',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/60740cf2-7930-4737-850c-b5d440d1bc4f.avif',
    product_category_id: productTypes[0].id,
    name: 'Оформление стульев (чехлы/банты)',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/1beb2bdd-7b85-4bac-8935-818ca51e2082.avif',
    product_category_id: productTypes[0].id,
    name: 'Ковровая дорожка',
  },
  {
    image:
      'https://l9pg1zrchessfus1.public.blob.vercel-storage.com/ab9bfa2e-cb8d-4644-a63b-bd61ae6c0605.avif',
    product_category_id: productTypes[0].id,
    name: 'Кенди-бар (декор и посуда)',
  },
];

export const eventTypes = [
  {
    id: 'f9b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b1',
    name: 'Свадьба',
  },
  {
    id: 'f9b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b2',
    name: 'День Рождения',
  },
  {
    id: 'f9b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b3',
    name: 'Корпоратив',
  },
  {
    id: 'f9b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b4',
    name: 'Детский праздник',
  },
];

export const eventRequests = [
  {
    id: 'a1b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b1',
    name: 'Иван Иванов',
    phone: '+7-999-123-45-67',
    event_type_id: eventTypes[0].id,
    start_date: new Date('2026-06-15T16:00:00Z'),
    end_date: new Date('2026-06-15T22:00:00Z'),
    guests: 50,
    budget: 150000,
    status: 'unconfirmed' as const,
    address: 'ул. Пушкина, д. Колотушкина',
    comment: 'Нужен ведущий и диджей',
  },
  {
    id: 'a1b1b1b1-b1b1-41b1-b1b1-b1b1b1b1b1b2',
    name: 'Мария Петрова',
    phone: '+7-999-765-43-21',
    event_type_id: eventTypes[1].id,
    start_date: new Date('2026-07-20T14:00:00Z'),
    end_date: new Date('2026-07-20T18:00:00Z'),
    guests: 20,
    budget: 50000,
    status: 'unconfirmed' as const,
    address: 'пр. Мира, д. 10',
    comment: 'Торт обязателен',
  },
];
