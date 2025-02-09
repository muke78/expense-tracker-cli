// Función para cargar chalk dinámicamente
export const loadChalk = async () => {
  const chalk = await import('chalk');
  return chalk.default;
};
