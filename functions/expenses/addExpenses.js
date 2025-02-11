import inquirer from 'inquirer';
import { loadChalk } from '../../middleware/loadChalk.js';
import { loadExpenses } from '../../middleware/loadExpenses.js';
import { loadCategories } from '../../middleware/loadCategories.js';
import { saveExpenses } from '../../middleware/saveExpenses.js';
import { isValidDate } from '../../middleware/validateDate.js';

// Función para agregar un gasto
export const addExpense = async () => {
  const expenses = loadExpenses();
  const categories = loadCategories();
  const chalk = await loadChalk();

  try {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'description',
        message: '✏️ Ingrese la descripción del gasto:',
        validate: (input) =>
          input.trim() ? true : 'La descripción no puede estar vacía.',
      },
      {
        type: 'input',
        name: 'amount',
        message: '💲 Ingrese el monto:',
        validate: (input) => {
          const numericAmount = Number(input);
          return !isNaN(numericAmount) && numericAmount >= 0
            ? true
            : 'El numero no debe contener letras y debe ser positivo';
        },
      },
      {
        type: 'confirm',
        name: 'useTodayDate',
        message: '📅 ¿Quieres usar la fecha de hoy?',
        default: true,
      },
      {
        type: 'list',
        name: 'id',
        message: '✏️ Elija la categoria a donde quiera incluirlo:',
        choices: categories.map((cat) => ({
          name: cat.category,
          value: cat.id,
        })),
      },
    ]);

    let date;
    if (answers.useTodayDate) {
      date = new Date().toISOString().split('T')[0];
    } else {
      const dateAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'date',
          message: '📅 Ingrese la fecha (YYYY-MM-DD):',
          validate: (input) =>
            isValidDate(input)
              ? true
              : 'Fecha inválida. Usa el formato YYYY-MM-DD y asegúrate de que sea una fecha válida.',
        },
      ]);
      date = dateAnswer.date;
    }

    const categoryToAdd = categories.find((cat) => cat.id === answers.id);

    const newExpense = {
      id: expenses.length + 1,
      date,
      description: answers.description,
      amount: Number(answers.amount),
      category: categoryToAdd.category,
    };

    expenses.push(newExpense);
    saveExpenses(expenses);

    console.log(chalk.green('\n✅ Gasto agregado correctamente:'));
    console.log(`📌 Descripción: ${newExpense.description}`);
    console.log(`💰 Monto: $${newExpense.amount}`);
    console.log(`📅 Fecha: ${newExpense.date}`);
    console.log(`🔡 Categoria: ${newExpense.category}`);
  } catch (error) {
    console.error(chalk.red('❌ Error al registrar el gasto:'), error.message);
    return;
  }
};
