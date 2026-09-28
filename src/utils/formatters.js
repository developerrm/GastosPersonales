export const formatMoney = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
};

export const formatMoneyCompact = (amount) => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(1)}k`;
  }
  return `$${num.toFixed(0)}`;
};

export const formatPercent = (val) => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  return `${num.toFixed(1)}%`;
};

export const getMonthName = (monthKey) => {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${months[month - 1]} ${year}`;
};

export const getShortMonthName = (monthKey) => {
  if (!monthKey) return '';
  const [year, month] = monthKey.split('-').map(Number);
  const shortMonths = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${shortMonths[month - 1]} '${String(year).slice(-2)}`;
};
