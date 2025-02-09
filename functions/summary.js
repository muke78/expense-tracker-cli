import { loadChalk } from '../middleware/loadChalk.js';
import { loadExpenses } from '../middleware/loadExpenses.js';

export const summaryExpenses = async () => {
  const chalk = await loadChalk();
  const expenses = loadExpenses();

  if (expenses.length === 0) {
    console.log(chalk.yellow('⚠️ No hay gastos registrados.'));
    return;
  }
  try {
    const summary = expenses.map((exp) => exp.amount);
    const total = summary.reduce((acc, amount) => acc + amount, 0);
    const formattedTotal = total.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    console.log(
      chalk.blue.bold(
        `💲 Total montos: ${chalk.greenBright('$' + formattedTotal)}`
      )
    );
  } catch (error) {
    console.error(
      chalk.red('❌ Error al calcular el total de los gastos:'),
      error.message
    );
  }
};
