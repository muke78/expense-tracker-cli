import inquirer from 'inquirer';
import { loadChalk } from '../../middleware/loadChalk.js';
import { loadCategories } from '../../middleware/loadCategories.js';
import { saveCategories } from '../../middleware/saveCategories.js';

// Función para agregar una categoria
export const addCategories = async () => {
  const categories = loadCategories();
  const chalk = await loadChalk();

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: '✏️ Ingrese la categoria:',
        validate: (input) =>
          input.trim() ? true : 'La descripcion no puede estar vacia',
      },
    ]);

    const newCategory = {
      id: categories.length + 1,
      category: answers.description,
    };

    const categoryExist = categories.some(
      (cat) => cat.category.toLowerCase() === newCategory.category.toLowerCase()
    );

    if (categoryExist) {
      console.log(chalk.yellow('⚠️ La categoria ya existe. Intente con otra.'));
      return addCategories();
    }

    categories.push(newCategory);
    saveCategories(categories);

    console.log(chalk.green('\n✅ Categoria agregada correctamente:'));
    console.log(`📌 Categoria: ${newCategory.category}`);
  } catch (error) {
    console.error(
      chalk.red('❌ Error al registrar la categoria'),
      error.message
    );
    return;
  }
};
