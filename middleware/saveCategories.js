import { promises as fs } from 'node:fs';

const CATEGORIES_FILE = 'categories.json';

export const saveCategories = async (categories) => {
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2));
};
