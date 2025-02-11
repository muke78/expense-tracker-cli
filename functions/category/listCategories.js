import { loadChalk } from '../../middleware/loadChalk.js';
import { loadCategories } from '../../middleware/loadCategories.js';

// Función para mostrar la lista de categorias
export const listCategories = async () => {
  const chalk = await loadChalk();
  const categories = loadCategories();

  if (categories.length === 0) {
    console.log(chalk.yellow('⚠️ No hay categorias registradas.'));
    return;
  }

  console.log(chalk.blue.bold('🔡 Lista de categorias:'));
  console.table(
    categories.map((cat) => ({
      ID: `#${cat.id}`,
      Category: cat.category,
    }))
  );
};
