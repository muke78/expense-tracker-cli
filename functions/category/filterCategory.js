import inquirer from 'inquirer';
import { loadExpenses } from '../../middleware/loadExpenses.js';
import { loadCategories } from '../../middleware/loadCategories.js';
import { loadChalk } from '../../middleware/loadChalk.js';

export const filterCategory = async () => {
  try {
    const [chalk, expenses, categories] = await Promise.all([
      loadChalk(),
      loadExpenses(),
      loadCategories(),
    ]);

    if (expenses.length === 0 || categories.length === 0) {
      console.log(chalk.yellow('⚠️ No hay gastos registrados o categorías.'));
      return;
    }
    const { id: selectedCategoryId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '✏️ Elija la categoria que desea filtrar:',
        choices: categories.map((cat) => ({
          name: cat.category,
          value: cat.id,
        })),
      },
    ]);

    const selectedCategory = categories.find(
      ({ id }) => id === selectedCategoryId
    );

    const filteredExpenses = expenses
      .filter(({ category }) => category === selectedCategory.category)
      .map(({ id, date, category, description, amount }) => ({
        ID: `#${id}`,
        Fecha: date,
        Categoría: category,
        Descripción: description,
        Monto: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(amount),
      }));

    console.table(filteredExpenses);
  } catch (error) {
    console.error(
      chalk.red('❌ Error al filtrar los gastos por categoria:'),
      error.message
    );
    return;
  }
};
