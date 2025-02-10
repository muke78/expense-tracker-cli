import { promises as fs } from 'node:fs';
import { loadChalk } from '../middleware/loadChalk.js';
import path from 'node:path';

const convertToCSV = (data) => {
  const headers = Object.keys(data[0]);

  const rows = data.map((item) =>
    headers.map((header) => `"${item[header]}"`).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  return csv;
};

export const exportCSV = async () => {
  const chalk = await loadChalk();
  const jsonFilePath = path.resolve('../expense-tracker-cli/expense.json');
  const csvFilePath = path.resolve('../expense-tracker-cli/csv/expense.csv');

  try {
    const data = await fs.readFile(jsonFilePath, 'utf-8');
    const jsonConvert = JSON.parse(data);

    const csv = convertToCSV(jsonConvert);

    await fs.writeFile(csvFilePath, csv, 'utf-8');

    console.log(chalk.green('✅ CSV exportado con exito'));
  } catch (error) {
    console.error(chalk.red('❌ Error al exportar el csv:'), error.message);
  }
};
