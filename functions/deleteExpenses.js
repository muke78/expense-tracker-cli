import inquirer from 'inquirer';
import { loadChalk } from '../middleware/loadChalk.js';
import { loadExpenses } from '../middleware/loadExpenses.js';
import { saveExpenses } from '../middleware/saveExpenses.js';

export const deleteExpense = async () => {
  const chalk = await loadChalk();
  let expenses = loadExpenses();

  if (expenses.length === 0) {
    console.log(chalk.yellow('⚠️ No hay gastos registrados.'));
    return;
  }

  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '❌ Elija el item que desea eliminar:',
        choices: expenses.map((exp) => ({
          name: `${exp.description} - $${exp.amount}`, // Mostramos la descripción y el monto
          value: exp.id,
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

    const expenseToDelete = expenses.find((exp) => exp.id === answers.id);

    if (!expenseToDelete) {
      console.log(chalk.red('❌ No se encontró el gasto.'));
      return;
    }

    expenses = expenses.filter((exp) => exp.id !== expenseToDelete.id);

    saveExpenses(expenses);
    console.log(chalk.green('✅ Gasto eliminado correctamente:'));
    console.log(`📌 Descripción: ${expenseToDelete.description}`);
    console.log(`💰 Monto: $${expenseToDelete.amount}`);
    console.log(`📅 Fecha: ${expenseToDelete.date}`);
  } catch (error) {
    console.error(chalk.red('❌ Error al eliminar el gasto:'), error.message);
  }
};
