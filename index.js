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
} from './functions/index.js';

const program = new Command();

// Configuración del programa
program
  .name('expense-tracker-cli')
  .description(
    ` CLI para control de gastos    
    `
  )
  .version('1.0.0');

// Comando para listar gastos
program
  .command('list')
  .description('Muestra el listado de gastos registrados.')
  .addHelpText(
    'after',
    `
Ejemplos:
  $ node index.js list
  💲 Lista de gastos:
┌─────────┬──────┬───────────────┬─────────────────────┬──────────┐
│ (index) │  ID  │    Fecha      │     Descripción     │  Monto   │
├─────────┼──────┼───────────────┼─────────────────────┼──────────┤
│    0    │ '#1' │ '2023-10-25'  │ 'Pago suscripción'  │ '$15.00' │
│    1    │ '#2' │ '2023-10-26'  │ 'Compra de insumos' │ '$20.00' │
└─────────┴──────┴───────────────┴─────────────────────┴──────────┘

Notas:
  - Los gastos se muestran en formato de tabla.
  - Si no hay gastos registrados, se mostrará un mensaje indicándolo.
  `
  )
  .action(listExpenses);

// Comando para agregar un gasto
program
  .command('add')
  .description('Agregar un gasto de manera interactiva.')
  .addHelpText(
    'after',
    `
Ejemplos:
  $ node index.js add
  ✏️ Ingrese la descripción del gasto: Comida
  💲 Ingrese el monto: 1500
  📅 ¿Quieres usar la fecha de hoy? (Y/n): Y

Notas:
  - El monto debe ser un número positivo.
  - Si eliges no usar la fecha de hoy, ingresa la fecha en formato YYYY-MM-DD.
  `
  )
  .action(addExpense);

// Comando para editar un gasto
program
  .command('edit')
  .description('Edita un gasto de manera interactiva')
  .action(editExpense);

// Comando para eliminar un gasto
program
  .command('delete')
  .description('Elimina un gasto de manera interactiva')
  .action(deleteExpense);

// Comando para ver el total de montos
program
  .command('summary')
  .description('Ve un total de todos los montos que se encuentran registrados')
  .action(summaryExpenses);

// Comando para ver el total de montos por mes
program
  .command('summary-m')
  .description(
    'Ve un total de todos los montos que se encuentran registrados por mes'
  )
  .action(summaryPeriodExpenses);

// Comando para exportar a csv
program
  .command('export')
  .description('Exporta a csv los datos guardados')
  .action(exportCSV);

// Comando para cargar csv a data
program
  .command('import')
  .description('Exporta a data los datos desde un csv')
  .action(exportObject);

// Comando para agregar una categoria
program
  .command('add-c')
  .description('Agrega una categoria para un producto o gasto')
  .action(addCategories);

// Comando para listar las categorias
program
  .command('list-c')
  .description('Lista todas las categorias')
  .action(listCategories);

// Comando para editar las categorias
program
  .command('edit-c')
  .description('Edita la categoria de manera interactiva')
  .action(editCategory);

// Comando para eliminar las categorias
program
  .command('delete-c')
  .description('Elimina la categoria de manera interactiva')
  .action(deleteCategory);

// Comando para eliminar las categorias
program
  .command('filter-c')
  .description('Filtra los gastos que hay por categoria')
  .action(filterCategory);

// Parsear los argumentos de la línea de comandos
program.parse(process.argv);
