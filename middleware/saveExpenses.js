import { writeFileSync } from 'node:fs';

const EXPENSE_FILE = 'expense.json';

// Función para guardar el archivo de gastos
export const saveExpenses = (expenses) => {
  writeFileSync(EXPENSE_FILE, JSON.stringify(expenses, null, 2));
};
