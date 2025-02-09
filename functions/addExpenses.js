import inquirer from 'inquirer';
import { loadChalk } from '../middleware/loadChalk.js';
import { loadExpenses } from '../middleware/loadExpenses.js';
import { saveExpenses } from '../middleware/saveExpenses.js';

// Función para agregar un gasto
export const addExpense = async () => {
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
            : 'El monto debe ser un número positivo.';
        },
      },
      {
        type: 'confirm',
        name: 'useTodayDate',
        message: '📅 ¿Quieres usar la fecha de hoy?',
        default: true,
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
            /\d{4}-\d{2}-\d{2}/.test(input)
              ? true
              : 'Formato inválido. Usa YYYY-MM-DD.',
        },
      ]);
      date = dateAnswer.date;
    }

    const expenses = loadExpenses();
    const newExpense = {
      id: expenses.length + 1,
      date,
      description: answers.description,
      amount: Number(answers.amount),
    };

    expenses.push(newExpense);
    saveExpenses(expenses);

    console.log(chalk.green('\n✅ Gasto agregado correctamente:'));
    console.log(`📌 Descripción: ${newExpense.description}`);
    console.log(`💰 Monto: $${newExpense.amount}`);
    console.log(`📅 Fecha: ${newExpense.date}`);
  } catch (error) {
    console.log(chalk.red('❌ Error al registrar el gasto:'), error.message);
  }
};
