import { promises as fs } from 'node:fs';
import { loadChalk } from '../middleware/loadChalk.js';
import { saveExpenses } from '../middleware/saveExpenses.js';
import path from 'node:path';

const convertToObject = async (data) => {
  const lines = data
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line);

  const headers = lines[0].split(',').slice(1); // Excluir 'id' del CSV

  const results = lines.slice(1).map((line, index) => {
    const values = line.split(',');
    return headers.reduce(
      (obj, header, idx) => {
        // Convertir 'amount' a número
        if (header.trim() === 'amount') {
          obj[header.trim()] =
            parseFloat(values[idx + 1].trim().replace(/^"|"$/g, '')) || 0;
        } else {
          obj[header.trim()] = values[idx + 1]
            ? values[idx + 1].trim().replace(/^"|"$/g, '')
            : '';
        }
        return obj;
      },
      { id: index + 1 }
    );
  });

  return results;
};

export const exportObject = async () => {
  const chalk = await loadChalk();
  const csvFilePath = path.resolve('./data.csv');

  try {
    const data = await fs.readFile(csvFilePath, 'utf-8');
    const newData = await convertToObject(data);

    let existingData = [];

    try {
      const existingDataRaw = await fs.readFile('./expense.json', 'utf-8');
      existingData = JSON.parse(existingDataRaw);
    } catch (error) {
      console.log(
        chalk.yellow(
          '⚠️ No se encontró un archivo existente. Creando uno nuevo.'
        )
      );
    }
    const lastId =
      existingData.length > 0 ? existingData[existingData.length - 1].id : 0;

    const updateNewData = newData.map((item, index) => ({
      ...item,
      id: lastId + index + 1,
    }));

    const combinedData = [...existingData, ...updateNewData];

    await saveExpenses(combinedData);
    console.log(chalk.green('✅ CSV importado'));
  } catch (error) {
    console.error(
      chalk.red('❌ Error al leer el CSV y subirlo:'),
      error.message
    );
    return;
  }
};
