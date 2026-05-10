import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // Используем современные модули
  target: 'node20', // Vercel Node.js runtime
  clean: true, // Чистим папку dist перед билдом
  minify: false, // Для бэкенда минификация обычно не нужна (проще дебажить)
  sourcemap: true, // Чтобы в логах видеть реальные строки ошибок
  splitting: false, // Отключаем splitting для получения единого файла
  shims: true, // Добавляем шимы для ESM (например, __dirname)

  noExternal: ['@aow/types', '@aow/database'],
});
