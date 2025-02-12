import { Command } from 'commander';
import {
  listExpenses,
  addExpense,
  editExpense,
  deleteExpense,
  summaryExpenses,
  summaryPeriodExpenses,
  exportCSV,
  exportObject,
  addCategories,
  listCategories,
  editCategory,
  deleteCategory,
  filterCategory,
  budgetLimitPerMonth
} from './functions/index.js';

const program = new Command();

// Configuración básica del programa
program
  .name('expense-tracker-cli')
  .description('CLI para control de gastos')
  .version('1.0.0');

// Funciones auxiliares para configurar comandos
const configureCommand = (command, description, action, helpText = '') => {
  const cmd = program.command(command).description(description).action(action);
  if (helpText) cmd.addHelpText('after', helpText);
};

// Comandos relacionados con gastos
const expenseCommands = [
  { command: 'list', description: 'Muestra el listado de gastos registrados.', action: listExpenses },
  { command: 'add', description: 'Agregar un gasto de manera interactiva.', action: addExpense },
  { command: 'edit', description: 'Edita un gasto de manera interactiva', action: editExpense },
  { command: 'delete', description: 'Elimina un gasto de manera interactiva', action: deleteExpense },
  { command: 'summary', description: 'Ve un total de todos los montos que se encuentran registrados', action: summaryExpenses },
  { command: 'summary-m', description: 'Ve un total de todos los montos que se encuentran registrados por mes', action: summaryPeriodExpenses },
  { command: 'export', description: 'Exporta a csv los datos guardados', action: exportCSV },
  { command: 'import', description: 'Exporta a data los datos desde un csv', action: exportObject },
  { command: 'limit', description: 'Establecer un limite de presupuesto a un mes en especifico', action: budgetLimitPerMonth },
];

// Comandos relacionados con categorías
const categoryCommands = [
  { command: 'add-c', description: 'Agrega una categoria para un producto o gasto', action: addCategories },
  { command: 'list-c', description: 'Lista todas las categorias', action: listCategories },
  { command: 'edit-c', description: 'Edita la categoria de manera interactiva', action: editCategory },
  { command: 'delete-c', description: 'Elimina la categoria de manera interactiva', action: deleteCategory },
  { command: 'filter-c', description: 'Filtra los gastos que hay por categoria', action: filterCategory },
];

// Configurar comandos de gastos
expenseCommands.forEach(({ command, description, action }) => {
  configureCommand(command, description, action);
});

// Configurar comandos de categorías
categoryCommands.forEach(({ command, description, action }) => {
  configureCommand(command, description, action);
});

// Parsear los argumentos de la línea de comandos
program.parse(process.argv);