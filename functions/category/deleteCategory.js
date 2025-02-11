import inquirer from 'inquirer';
import { loadChalk } from '../../middleware/loadChalk.js';
import { loadCategories } from '../../middleware/loadCategories.js';
import { saveCategories } from '../../middleware/saveCategories.js';

export const deleteCategory = async () => {
  const chalk = await loadChalk();
  let categories = loadCategories();

  if (categories.length === 0) {
    console.log(chalk.yellow('⚠️ No hay categorias registradas.'));
    return;
  }

  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '❌ Elija la categoria que desea eliminar:',
        choices: categories.map((cat) => ({
          name: cat.category,
          value: cat.id,
        })),
      },
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: '❔ ¿Esta seguro de eliminar este item?',
        default: false,
      },
    ]);

    if (!answers.confirmDelete) {
      console.log(chalk.yellow('❌ Eliminación cancelada.'));
      return;
    }

    const categoryToDelete = categories.find((cat) => cat.id === answers.id);

    if (!categoryToDelete) {
      console.log(chalk.red('❌ No se encontró el gasto.'));
      return;
    }

    categories = categories.filter((cat) => cat.id !== categoryToDelete.id);

    saveCategories(categories);
    console.log(chalk.green('✅ Categoria eliminada correctamente:'));
    console.log(`📌 Categoria: ${categoryToDelete.category}`);
  } catch (error) {
    console.error(
      chalk.red('❌ Error al eliminar la categoria:'),
      error.message
    );
  }
};
