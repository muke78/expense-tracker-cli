import inquirer from 'inquirer';
import { loadExpenses } from '../middleware/loadExpenses.js';
import { loadCategories } from '../middleware/loadCategories.js';
import { loadLimits } from '../middleware/loadLimits.js';
import { loadChalk } from '../middleware/loadChalk.js';
import { saveLimits } from '../middleware/saveLimits.js';

export const budgetLimitPerMonth = async () => {
  const chalk = await loadChalk();
  const expenses = loadExpenses();
  const categories = loadCategories();
  const limits = loadLimits();

  try {
    if (expenses.length === 0 || categories.length === 0) {
      console.log(chalk.yellow('⚠️ No hay gastos registrados o categorías.'));
      return;
    }

    // Generar opciones de meses disponibles
    const monthOptions = [
      ...new Set(expenses.map((exp) => exp.date.slice(0, 7))),
    ].map((month) => ({
      name: month,
      value: { month },
    }));

    if (monthOptions.length === 0) {
      console.log(
        chalk.yellow('⚠️ No hay meses disponibles para asignar un límite.')
      );
      return;
    }

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'id',
        message: '🔢 Elija el mes para poner un límite de presupuesto',
        choices: monthOptions,
      },
      {
        type: 'input',
        name: 'limitBudget',
        message: '✏️ Ingrese un límite de presupuesto para el mes indicado: ',
        validate: (input) => {
          const trimmedInput = input.trim();
          if (!trimmedInput) {
            return 'El límite no puede estar vacío.';
          }
          const numericAmount = parseFloat(trimmedInput);
          if (isNaN(numericAmount) || numericAmount < 0) {
            return 'El monto debe ser un número positivo.';
          }
          return true;
        },
      },
    ]);

    const { month } = answers.id;
    const [year, monthNumber] = month.split('-');
    const dateNumber = new Date(year, monthNumber - 1).toISOString().split('T')[0];
    const monthName = new Date(year, monthNumber - 1).toLocaleString('default', { month: 'long' });
    const limitNumber = Number(answers.limitBudget);

    const newLimits = {
      id: limits.length + 1,
      date: dateNumber,
      dateLong: monthName,
      limit: limitNumber,
    };

    const LimitExist = limits.some((lmt) => lmt.date === newLimits.date);

    if (LimitExist) {
      console.log(chalk.yellow('⚠️ La fecha con el limite ya existe'));
      return budgetLimitPerMonth();
    }

    limits.push(newLimits);
    saveLimits(limits);

    console.log(chalk.green('\n✅ Limite agregado correctamente:'));
    console.log(`📅 Fecha: ${newLimits.date}`);
    console.log(`📅 Fecha larga: $${newLimits.dateLong}`);
    console.log(`💰 Limite: ${chalk.cyan('$', newLimits.limit)}`);
  } catch (error) {
    console.error(
      chalk.red('❌ Error al guadrdar el limite por mes:'),
      error.message
    );
    return;
  }
};
