import { loadChalk } from '../middleware/loadChalk.js';
import { loadExpenses } from '../middleware/loadExpenses.js';
import inquirer from 'inquirer';

export const summaryPeriodExpenses = async () => {
  const chalk = await loadChalk();
  const expenses = loadExpenses();
  if (expenses.length === 0) {
    console.log(chalk.yellow('⚠️ No hay gastos registrados.'));
    return;
  }
  try {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '🔢 Elija el mes para calcular el total de gastos',
        choices: () => {
          const monthlyTotals = {};

          expenses.forEach((exp) => {
            const month = exp.date.slice(0, 7);
            monthlyTotals[month] = (monthlyTotals[month] || 0) + exp.amount;
          });

          return Object.entries(monthlyTotals).map(([month, total]) => ({
            name: month,
            value: { month, total },
          }));
        },
      },
    ]);

    const { month, total } = answers.id;

    const [year, monthNumber] = month.split('-');
    const date = new Date(year, monthNumber - 1);

    const monthName = date.toLocaleString('default', { month: 'long' });

    const formattedTotal = total.toLocaleString('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    console.log(
      chalk.blue.bold(
        `💰 Total de gastos en ${chalk.gray(monthName)}: ${chalk.greenBright(
          '$' + formattedTotal
        )}`
      )
    );
  } catch (error) {
    console.error(
      chalk.red('❌ Error al calcular el total de los gastos por mes:'),
      error.message
    );
  }
};
