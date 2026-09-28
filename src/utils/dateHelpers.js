/**
 * Helper to calculate due urgency and days remaining
 */
export const getExpenseUrgency = (expense, monthKey) => {
  const payment = expense.monthlyPayments?.[monthKey];
  const isPaid = payment?.status === 'paid';

  if (isPaid) {
    return {
      status: 'paid',
      label: 'Pagado',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      daysLeft: 0,
      isUrgent: false,
    };
  }

  const [yearStr, monthStr] = (monthKey || '2026-09').split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1; // 0-indexed

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();

  // If viewed month is past
  const isPastMonth = year < currentYear || (year === currentYear && month < currentMonth);
  const isFutureMonth = year > currentYear || (year === currentYear && month > currentMonth);
  const isCurrentMonth = year === currentYear && month === currentMonth;

  const dueDay = expense.dueDay || 1;

  if (isPastMonth) {
    return {
      status: 'overdue',
      label: 'Vencido',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      daysLeft: -1,
      isUrgent: true,
    };
  }

  if (isFutureMonth) {
    return {
      status: 'future',
      label: `Día ${dueDay}`,
      badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      daysLeft: 30,
      isUrgent: false,
    };
  }

  // Currently in this month
  const daysDiff = dueDay - currentDay;

  if (daysDiff < 0) {
    return {
      status: 'overdue',
      label: `Venció hace ${Math.abs(daysDiff)} d`,
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse',
      daysLeft: daysDiff,
      isUrgent: true,
    };
  } else if (daysDiff === 0) {
    return {
      status: 'critical',
      label: '¡Vence Hoy!',
      badgeClass: 'bg-rose-600/30 text-rose-200 border-rose-500/60 font-bold animate-bounce',
      daysLeft: 0,
      isUrgent: true,
    };
  } else if (daysDiff <= 3) {
    return {
      status: 'critical',
      label: `Vence en ${daysDiff} días`,
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
      daysLeft: daysDiff,
      isUrgent: true,
    };
  } else if (daysDiff <= 7) {
    return {
      status: 'upcoming',
      label: `En ${daysDiff} días`,
      badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      daysLeft: daysDiff,
      isUrgent: false,
    };
  } else {
    return {
      status: 'normal',
      label: `Día ${dueDay} (${daysDiff} d)`,
      badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
      daysLeft: daysDiff,
      isUrgent: false,
    };
  }
};

/**
 * Returns calendar grid for a given monthKey (YYYY-MM)
 */
export const getMonthCalendarGrid = (monthKey) => {
  const [yearStr, monthStr] = (monthKey || '2026-09').split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sunday
  // Adjust so Monday is 0
  const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const totalDays = new Date(year, month + 1, 0).getDate();

  const days = [];
  // Empty padding cells before 1st day
  for (let i = 0; i < startDay; i++) {
    days.push({ dayNumber: null, isPadding: true });
  }

  // Days of month
  for (let d = 1; d <= totalDays; d++) {
    days.push({ dayNumber: d, isPadding: false });
  }

  return days;
};
