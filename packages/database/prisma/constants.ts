export const productTypes = [
  {
    id: '8f9ab0f7-de94-4fb1-b58a-19695cc13d98',
    name: `Одежда "коллекция Свадебка"`,
    order: 1,
  },
  { id: 'c39610c5-942f-4ab2-897a-b0761874a0bc', name: 'Блузки', order: 2 },
  {
    id: '3f9c13e5-ca39-40a1-b2b6-3fb78d4fecc3',
    name: 'Головные уборы',
    order: 3,
  },
];

export const products = [
  // блузки
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/blouse1.jpg',
    product_category_id: productTypes[1].id,
    name: 'Блузка 1',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/blouse2.jpg',
    product_category_id: productTypes[1].id,
    name: 'Блузка 2',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/blouse3.jpg',
    product_category_id: productTypes[1].id,
    name: 'Блузка 3',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/blouse4.jpg',
    product_category_id: productTypes[1].id,
    name: 'Блузка 4',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/blouse5.jpg',
    product_category_id: productTypes[1].id,
    name: 'Блузка 5',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/blouse6.jpg',
    product_category_id: productTypes[1].id,
    name: 'Блузка 6',
  },
  // шапки
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat1.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 1',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat2.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 2',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat3.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 3',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat4.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 4',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat5.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 5',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat6.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 6',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/hat7.jpg',
    product_category_id: productTypes[2].id,
    name: 'Головной убор 7',
  },
  // одежка свадебка
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product1.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 1',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product2.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 2',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product3.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 3',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product4.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 4',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product5.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 5',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product6.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 6',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product7.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 7',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product8.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 8',
  },
  {
    image: 'https://cdn.us-ta.ru/aow-s3/products/product9.jpg',
    product_category_id: productTypes[0].id,
    name: 'Одежда 9',
  },
];

export const eventTypes = [
  {
    id: 'f9b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1',
    name: 'Свадьба',
  },
  {
    id: 'f9b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b2',
    name: 'День Рождения',
  },
  {
    id: 'f9b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b3',
    name: 'Корпоратив',
  },
  {
    id: 'f9b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b4',
    name: 'Детский праздник',
  },
];

export const eventRequests = [
  {
    id: 'a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b1',
    name: 'Иван Иванов',
    phone: '+79991234567',
    event_type_id: eventTypes[0].id,
    start_date: new Date('2026-06-15T16:00:00Z'),
    end_date: new Date('2026-06-15T22:00:00Z'),
    guests: 50,
    budget: 150000,
    status: 'new' as const,
    address: 'ул. Пушкина, д. Колотушкина',
    comment: 'Нужен ведущий и диджей',
  },
  {
    id: 'a1b1b1b1-b1b1-b1b1-b1b1-b1b1b1b1b1b2',
    name: 'Мария Петрова',
    phone: '+79997654321',
    event_type_id: eventTypes[1].id,
    start_date: new Date('2026-07-20T14:00:00Z'),
    end_date: new Date('2026-07-20T18:00:00Z'),
    guests: 20,
    budget: 50000,
    status: 'in_progress' as const,
    address: 'пр. Мира, д. 10',
    comment: 'Торт обязателен',
  },
];
