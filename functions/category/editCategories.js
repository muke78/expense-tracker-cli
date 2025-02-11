import inquirer from 'inquirer';
import { loadChalk } from '../../middleware/loadChalk.js';
import { loadCategories } from '../../middleware/loadCategories.js';
import { saveCategories } from '../../middleware/saveCategories.js';

// Funcion para editar una categoria
export const editCategory = async () => {
  const chalk = await loadChalk();
  const categories = loadCategories();

  if (categories.length === 0) {
    console.log(chalk.yellow('⚠️ No hay categorias registradas.'));
    return;
  }

  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '✏️ Elija la categoria que desea editar:',
        choices: categories.map((cat) => ({
          name: cat.category,
          value: cat.id,
        })),
      },
      {
        type: 'input',
        name: 'description',
        message: '✏️ Ingrese la nueva categoria:',
        validate: (input) =>
          input.trim() ? true : 'La descripción no puede estar vacía.',
      },
    ]);

    const categoriesToEdit = categories.find((cat) => cat.id === answers.id);

    if (!categoriesToEdit) {
      console.log(chalk.red('❌ No se encontró la categoria.'));
      return;
    }

    categoriesToEdit.category = answers.description;
    saveCategories(categories);
    console.log(chalk.green('\n✅ Se editó correctamente:'));
    console.log(`📌 Categoria: ${categoriesToEdit.category}`);
  } catch (error) {
    console.error(chalk.red('❌ Error al editar la categoria:'), error.message);
    return;
  }
};
