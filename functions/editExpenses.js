import inquirer from 'inquirer';
import { loadChalk } from '../middleware/loadChalk.js';
import { loadExpenses } from '../middleware/loadExpenses.js';
import { saveExpenses } from '../middleware/saveExpenses.js';

// Funcion para editar un gasto
export const editExpense = async () => {
  const chalk = await loadChalk();
  const expenses = loadExpenses();

  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '✏️ Elija el item que desea editar:',
        choices: expenses.map((exp) => ({
          name: exp.description,
          value: exp.id,
        })),
      },

      {
        type: 'input',
        name: 'description',
        message: '✏️ Ingrese la nueva descripcion:',
        validate: (input) =>
          input.trim() ? true : 'La descripción no puede estar vacía.',
      },
      {
        type: 'input',
        name: 'amount',
        message: (answers) => {
          const expense = expenses.find((exp) => exp.id === answers.id);

          const previousAmount = chalk.gray(
            `(Anterior: $${expense.amount.toFixed(2)})`
          );
          return `💲 Ingrese el nuevo monto ${previousAmount}:`;
        },
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
        message: '📅 ¿Quiere dejar la misma fecha o editarla?',
        default: true,
      },
    ]);

    const expenseToEdit = expenses.find((exp) => exp.id === answers.id);

    if (!expenseToEdit) {
      console.log(chalk.red('❌ No se encontró el gasto.'));
      return;
    }

    let date = expenseToEdit.date;
    if (!answers.useTodayDate) {
      const dateAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'date',
          message: '📅 Ingrese la nueva fecha (YYYY-MM-DD):',
          validate: (input) =>
            /\d{4}-\d{2}-\d{2}/.test(input)
              ? true
              : 'Formato inválido. Usa YYYY-MM-DD.',
        },
      ]);
      date = dateAnswer.date;
    }

    expenseToEdit.description = answers.description;
    expenseToEdit.amount = Number(answers.amount);
    expenseToEdit.date = date;

    saveExpenses(expenses);

    console.log(chalk.green('\n✅ Se editó correctamente:'));
    console.log(`📌 Descripción: ${expenseToEdit.description}`);
    console.log(`💰 Monto: $${expenseToEdit.amount.toFixed(2)}`);
    console.log(`📅 Fecha: ${expenseToEdit.date}`);
  } catch (error) {
    console.log(chalk.red('❌ Error al editar el gasto:'), error.message);
  }
};
