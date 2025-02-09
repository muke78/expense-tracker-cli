import { loadChalk } from '../middleware/loadChalk.js';
import { loadExpenses } from '../middleware/loadExpenses.js';

// Función para mostrar la lista de gastos
export const listExpenses = async () => {
  const chalk = await loadChalk();
  const expenses = loadExpenses();

  if (expenses.length === 0) {
    console.log(chalk.yellow('⚠️ No hay gastos registrados.'));
    return;
  }

  console.log(chalk.blue.bold('💲 Lista de gastos:'));
  console.table(
    expenses.map((expense) => ({
      ID: `#${expense.id}`,
      Fecha: expense.date,
      Descripción: expense.description,
      Monto: Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(expense.amount),
    }))
  );
};
