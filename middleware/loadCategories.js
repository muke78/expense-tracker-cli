import { existsSync, readFileSync } from 'node:fs';

const CATEGORIES_FILE = 'categories.json';

// Funcion para leer el archivo de categorias
export const loadCategories = () => {
  if (!existsSync(CATEGORIES_FILE)) return [];
  const data = readFileSync(CATEGORIES_FILE, 'utf-8');
  return JSON.parse(data);
};
