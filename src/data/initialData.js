export const INITIAL_BANKS = [
  {
    id: 'pichincha',
    name: 'Banco Pichincha',
    shortName: 'Pichincha',
    color: '#f59e0b',
    gradient: 'from-amber-500/20 to-yellow-600/30',
    borderColor: 'border-amber-500/40',
    textColor: 'text-amber-400',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    accountType: 'Cuenta de Ahorros',
    accountNumber: '••• 8492'
  },
  {
    id: 'bolivariano',
    name: 'Banco Bolivariano',
    shortName: 'Bolivariano',
    color: '#10b981',
    gradient: 'from-emerald-500/20 to-teal-600/30',
    borderColor: 'border-emerald-500/40',
    textColor: 'text-emerald-400',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    accountType: 'Cuenta Corriente',
    accountNumber: '••• 1045'
  },
  {
    id: 'produbanco',
    name: 'Produbanco',
    shortName: 'Produbanco',
    color: '#38bdf8',
    gradient: 'from-sky-500/20 to-blue-600/30',
    borderColor: 'border-sky-500/40',
    textColor: 'text-sky-400',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    accountType: 'Tarjeta de Crédito / Ahorros',
    accountNumber: '••• 6723'
  },
  {
    id: 'guayaquil',
    name: 'Banco Guayaquil',
    shortName: 'Guayaquil',
    color: '#ec4899',
    gradient: 'from-pink-500/20 to-rose-600/30',
    borderColor: 'border-pink-500/40',
    textColor: 'text-pink-400',
    badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    accountType: 'Cuenta Bancaria',
    accountNumber: '••• 9920'
  },
  {
    id: 'pacifico',
    name: 'Banco del Pacífico',
    shortName: 'Pacífico',
    color: '#818cf8',
    gradient: 'from-indigo-500/20 to-violet-600/30',
    borderColor: 'border-indigo-500/40',
    textColor: 'text-indigo-400',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    accountType: 'Cuenta de Ahorros',
    accountNumber: '••• 3314'
  },
  {
    id: 'efectivo',
    name: 'Efectivo / Caja',
    shortName: 'Efectivo',
    color: '#94a3b8',
    gradient: 'from-slate-500/20 to-zinc-600/30',
    borderColor: 'border-slate-500/40',
    textColor: 'text-slate-300',
    badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    accountType: 'Caja Física',
    accountNumber: 'Billetera'
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'servicios', name: 'Servicios Básicos', icon: 'Zap', color: '#38bdf8' },
  { id: 'tarjetas', name: 'Tarjetas & Deudas', icon: 'CreditCard', color: '#f87171' },
  { id: 'compras', name: 'Tiendas & Crédito', icon: 'ShoppingBag', color: '#fb923c' },
  { id: 'familia', name: 'Familia & Apoyo', icon: 'Heart', color: '#f472b6' },
  { id: 'inversiones', name: 'Inversiones (ETF)', icon: 'TrendingUp', color: '#a78bfa' },
  { id: 'ahorro', name: 'Ahorro Programado', icon: 'PiggyBank', color: '#34d399' },
  { id: 'vivienda', name: 'Vivienda & Hogar', icon: 'Home', color: '#facc15' },
  { id: 'otros', name: 'Otros Gastos', icon: 'MoreHorizontal', color: '#94a3b8' }
];

export const INITIAL_MONTHS = [
  { key: '2026-09', label: 'Septiembre 2026', shortLabel: 'Sep 26', income: 500 },
  { key: '2026-10', label: 'Octubre 2026', shortLabel: 'Oct 26', income: 1000 },
  { key: '2026-11', label: 'Noviembre 2026', shortLabel: 'Nov 26', income: 1000 },
  { key: '2026-12', label: 'Diciembre 2026', shortLabel: 'Dic 26', income: 1000 },
  { key: '2027-01', label: 'Enero 2027', shortLabel: 'Ene 27', income: 1000 },
  { key: '2027-02', label: 'Febrero 2027', shortLabel: 'Feb 27', income: 1000 }
];

export const INITIAL_INCOMES = {
  '2026-09': { baseSalary: 500, extraIncome: 0, notes: 'Sueldo de Septiembre' },
  '2026-10': { baseSalary: 1000, extraIncome: 0, notes: 'Sueldo proyectado Octubre' },
  '2026-11': { baseSalary: 1000, extraIncome: 0, notes: 'Sueldo proyectado Noviembre' },
  '2026-12': { baseSalary: 1000, extraIncome: 0, notes: 'Sueldo proyectado Diciembre' },
  '2027-01': { baseSalary: 1000, extraIncome: 0, notes: 'Sueldo proyectado Enero' },
  '2027-02': { baseSalary: 1000, extraIncome: 0, notes: 'Sueldo proyectado Febrero' }
};

export const INITIAL_EXPENSES = [
  {
    id: 'exp-1',
    name: 'LUZ',
    bankId: 'pichincha',
    categoryId: 'servicios',
    billingDay: 18,
    dueDay: 25,
    estimatedAmount: 35.00,
    priority: 'high',
    notes: 'Servicio eléctrico - corte el 18, maximo el 25',
    monthlyPayments: {
      '2026-09': { amount: 0, status: 'paid', note: 'pagado' },
      '2026-10': { amount: 0, status: 'pending', note: '-' },
      '2026-11': { amount: 0, status: 'pending', note: '-' },
      '2026-12': { amount: 0, status: 'pending', note: '-' },
      '2027-01': { amount: 0, status: 'pending', note: '-' },
      '2027-02': { amount: 0, status: 'pending', note: '-' }
    }
  },
  {
    id: 'exp-2',
    name: 'INTERNET',
    bankId: 'bolivariano',
    categoryId: 'servicios',
    billingDay: 8,
    dueDay: 8,
    estimatedAmount: 30.00,
    priority: 'high',
    notes: 'Fibra óptica hogar',
    monthlyPayments: {
      '2026-09': { amount: 30.00, status: 'paid', note: 'Pagado puntual' },
      '2026-10': { amount: 30.00, status: 'pending', note: '' },
      '2026-11': { amount: 30.00, status: 'pending', note: '' },
      '2026-12': { amount: 30.00, status: 'pending', note: '' },
      '2027-01': { amount: 30.00, status: 'pending', note: '' },
      '2027-02': { amount: 30.00, status: 'pending', note: '' }
    }
  },
  {
    id: 'exp-3',
    name: 'TARJETA CREDITO',
    bankId: 'produbanco',
    categoryId: 'tarjetas',
    billingDay: 15,
    dueDay: 2,
    estimatedAmount: 400.00,
    priority: 'high',
    notes: 'Corte 15, pago máximo 2 de cada mes',
    monthlyPayments: {
      '2026-09': { amount: 150.00, status: 'paid', note: 'Abono realizado' },
      '2026-10': { amount: 300.00, status: 'pending', note: 'Cuota programada' },
      '2026-11': { amount: 300.00, status: 'pending', note: 'Cuota programada' },
      '2026-12': { amount: 300.00, status: 'pending', note: 'Cuota programada' },
      '2027-01': { amount: 300.00, status: 'pending', note: 'Cuota programada' },
      '2027-02': { amount: 300.00, status: 'pending', note: 'Cuota programada' }
    }
  },
  {
    id: 'exp-4',
    name: 'DEPRATI',
    bankId: 'bolivariano',
    categoryId: 'compras',
    billingDay: 22,
    dueDay: 22,
    estimatedAmount: 100.00,
    priority: 'medium',
    notes: 'Tarjeta departamental DePrati',
    monthlyPayments: {
      '2026-09': { amount: 0, status: 'paid', note: 'Sin deuda este mes' },
      '2026-10': { amount: 100.00, status: 'pending', note: '' },
      '2026-11': { amount: 100.00, status: 'pending', note: '' },
      '2026-12': { amount: 100.00, status: 'pending', note: '' },
      '2027-01': { amount: 100.00, status: 'pending', note: '' },
      '2027-02': { amount: 100.00, status: 'pending', note: '' }
    }
  },
  {
    id: 'exp-5',
    name: 'Papá',
    bankId: 'pichincha',
    categoryId: 'familia',
    billingDay: 1,
    dueDay: 1,
    estimatedAmount: 50.00,
    priority: 'high',
    notes: 'Aporte familiar',
    monthlyPayments: {
      '2026-09': { amount: 40.00, status: 'paid', note: 'Transferido' },
      '2026-10': { amount: 50.00, status: 'pending', note: '' },
      '2026-11': { amount: 50.00, status: 'pending', note: '' },
      '2026-12': { amount: 50.00, status: 'pending', note: '' },
      '2027-01': { amount: 50.00, status: 'pending', note: '' },
      '2027-02': { amount: 50.00, status: 'pending', note: '' }
    }
  },
  {
    id: 'exp-6',
    name: 'Mamá',
    bankId: 'pichincha',
    categoryId: 'familia',
    billingDay: 1,
    dueDay: 1,
    estimatedAmount: 50.00,
    priority: 'high',
    notes: 'Aporte familiar',
    monthlyPayments: {
      '2026-09': { amount: 40.00, status: 'paid', note: 'Transferido' },
      '2026-10': { amount: 50.00, status: 'pending', note: '' },
      '2026-11': { amount: 50.00, status: 'pending', note: '' },
      '2026-12': { amount: 50.00, status: 'pending', note: '' },
      '2027-01': { amount: 50.00, status: 'pending', note: '' },
      '2027-02': { amount: 50.00, status: 'pending', note: '' }
    }
  },
  {
    id: 'exp-7',
    name: 'Abuela',
    bankId: 'pichincha',
    categoryId: 'familia',
    billingDay: 1,
    dueDay: 1,
    estimatedAmount: 50.00,
    priority: 'high',
    notes: 'Aporte familiar',
    monthlyPayments: {
      '2026-09': { amount: 40.00, status: 'paid', note: 'Transferido' },
      '2026-10': { amount: 50.00, status: 'pending', note: '' },
      '2026-11': { amount: 50.00, status: 'pending', note: '' },
      '2026-12': { amount: 50.00, status: 'pending', note: '' },
      '2027-01': { amount: 50.00, status: 'pending', note: '' },
      '2027-02': { amount: 50.00, status: 'pending', note: '' }
    }
  },
  {
    id: 'exp-8',
    name: 'ETF',
    bankId: 'pichincha',
    categoryId: 'inversiones',
    billingDay: 1,
    dueDay: 1,
    estimatedAmount: 25.00,
    priority: 'medium',
    notes: 'Inversión recurrente en fondos indexados',
    monthlyPayments: {
      '2026-09': { amount: 25.00, status: 'paid', note: 'Comprado' },
      '2026-10': { amount: 25.00, status: 'pending', note: '' },
      '2026-11': { amount: 25.00, status: 'pending', note: '' },
      '2026-12': { amount: 25.00, status: 'pending', note: '' },
      '2027-01': { amount: 25.00, status: 'pending', note: '' },
      '2027-02': { amount: 25.00, status: 'pending', note: '' }
    }
  },
  {
    id: 'exp-9',
    name: 'Ahorro',
    bankId: 'pichincha',
    categoryId: 'ahorro',
    billingDay: 1,
    dueDay: 1,
    estimatedAmount: 350.00,
    priority: 'high',
    notes: 'Fondo de emergencia / ahorro programado',
    monthlyPayments: {
      '2026-09': { amount: 175.00, status: 'paid', note: 'Abono 50%' },
      '2026-10': { amount: 350.00, status: 'pending', note: '' },
      '2026-11': { amount: 350.00, status: 'pending', note: '' },
      '2026-12': { amount: 350.00, status: 'pending', note: '' },
      '2027-01': { amount: 350.00, status: 'pending', note: '' },
      '2027-02': { amount: 350.00, status: 'pending', note: '' }
    }
  }
];
