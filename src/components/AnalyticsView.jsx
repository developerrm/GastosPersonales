import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  ComposedChart,
  Line
} from 'recharts';
import {
  PieChart as PieIcon,
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  Percent,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { formatMoney, formatPercent, getMonthName } from '../utils/formatters';

const METALLIC_PALETTE = [
  '#f59e0b', // Amber / Gold
  '#38bdf8', // Sky / Cyan
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#a855f7', // Purple
  '#fb923c', // Orange
  '#e2e8f0', // Platinum
  '#64748b'  // Slate
];

export const AnalyticsView = ({
  expenses,
  incomes,
  months,
  banks,
  categories,
  selectedMonth
}) => {
  const [activeChartTab, setActiveChartTab] = useState('overview'); // 'overview' | 'trends' | 'banks'

  // 1. Data for Category Pie Chart (Selected Month)
  const categoryMap = {};
  expenses.forEach((exp) => {
    const cat = categories.find((c) => c.id === exp.categoryId) || { name: 'Otros', color: '#94a3b8' };
    const payment = exp.monthlyPayments?.[selectedMonth];
    const amount = payment?.amount !== undefined ? Number(payment.amount) : Number(exp.estimatedAmount);

    if (!categoryMap[cat.name]) {
      categoryMap[cat.name] = { name: cat.name, value: 0, color: cat.color };
    }
    categoryMap[cat.name].value += amount;
  });
  const categoryChartData = Object.values(categoryMap).filter((item) => item.value > 0);

  // 2. Data for Bank Distribution (Selected Month)
  const bankMap = {};
  expenses.forEach((exp) => {
    const bank = banks.find((b) => b.id === exp.bankId) || { name: 'Otro', color: '#94a3b8' };
    const payment = exp.monthlyPayments?.[selectedMonth];
    const amount = payment?.amount !== undefined ? Number(payment.amount) : Number(exp.estimatedAmount);

    if (!bankMap[bank.name]) {
      bankMap[bank.name] = { name: bank.shortName || bank.name, total: 0, color: bank.color };
    }
    bankMap[bank.name].total += amount;
  });
  const bankChartData = Object.values(bankMap).filter((item) => item.total > 0);

  // 3. Multi-month Trend Cashflow Data
  const monthlyTrendsData = months.map((m) => {
    const mKey = m.key;
    const incObj = incomes[mKey] || { baseSalary: 1000, extraIncome: 0 };
    const income = (Number(incObj.baseSalary) || 0) + (Number(incObj.extraIncome) || 0);

    let totalGastos = 0;
    expenses.forEach((e) => {
      const payment = e.monthlyPayments?.[mKey];
      const val = payment?.amount !== undefined ? Number(payment.amount) : Number(e.estimatedAmount);
      totalGastos += val;
    });

    const saldo = income - totalGastos;

    return {
      month: m.shortLabel || m.label,
      Ingreso: income,
      Gastos: totalGastos,
      Saldo: saldo
    };
  });

  // Calculate Savings & Investment Ratio for selected month
  const currentIncomeObj = incomes[selectedMonth] || { baseSalary: 1000, extraIncome: 0 };
  const currentIncome = (Number(currentIncomeObj.baseSalary) || 0) + (Number(currentIncomeObj.extraIncome) || 0);

  let currentAhorroInversion = 0;
  expenses.forEach((e) => {
    if (e.categoryId === 'ahorro' || e.categoryId === 'inversiones' || e.name.toLowerCase().includes('ahorro') || e.name.toLowerCase().includes('etf')) {
      const payment = e.monthlyPayments?.[selectedMonth];
      currentAhorroInversion += payment?.amount !== undefined ? Number(payment.amount) : Number(e.estimatedAmount);
    }
  });

  const ahorroRatio = currentIncome > 0 ? (currentAhorroInversion / currentIncome) * 100 : 0;

  // Custom Dark Metallic Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-metal-950/95 p-3 rounded-xl border border-white/15 shadow-2xl backdrop-blur-md text-xs font-mono">
          <p className="font-bold text-white mb-1 font-sans">{label || payload[0]?.name}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color || entry.fill }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-metal-300 font-sans">{entry.name}:</span>
              </span>
              <span className="font-bold text-white">{formatMoney(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Insights Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Tasa de Ahorro & Inversión */}
        <div className="metallic-card-surface rounded-2xl p-4 border border-emerald-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
              Tasa Ahorro + Inversión
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            {formatPercent(ahorroRatio)}
          </div>
          <p className="text-[11px] text-metal-400 mt-1">
            Total destinado a patrimonio: <span className="font-bold text-white">{formatMoney(currentAhorroInversion)}</span>
          </p>
        </div>

        {/* Distribución Bancaria Predominante */}
        <div className="metallic-card-surface rounded-2xl p-4 border border-amber-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
              Banco con Mayor Carga
            </span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-sans truncate">
            {bankChartData.sort((a, b) => b.total - a.total)[0]?.name || 'N/A'}
          </div>
          <p className="text-[11px] text-metal-400 mt-1">
            Volumen: <span className="font-bold text-white">{formatMoney(bankChartData[0]?.total || 0)}</span>
          </p>
        </div>

        {/* Costo Diario Promedio */}
        <div className="metallic-card-surface rounded-2xl p-4 border border-sky-500/30">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
              Gasto Fijo Diario Promedio
            </span>
            <DollarSign className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-sky-300 font-mono">
            {formatMoney(
              (expenses.reduce((s, e) => s + (e.monthlyPayments?.[selectedMonth]?.amount || e.estimatedAmount), 0)) / 30
            )}
            <span className="text-xs font-normal text-metal-400">/día</span>
          </div>
          <p className="text-[11px] text-metal-400 mt-1">
            Calculado sobre 30 días del mes
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Pie Chart */}
        <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
                <PieIcon className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">
                Distribución por Categorías ({getMonthName(selectedMonth)})
              </h3>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color || METALLIC_PALETTE[index % METALLIC_PALETTE.length]}
                      stroke="rgba(0,0,0,0.4)"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span className="text-metal-300 text-xs">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Bank Bar Chart */}
        <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
                <Building2 className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-white text-sm">
                Gastos por Banco ({getMonthName(selectedMonth)})
              </h3>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total" name="Monto Total" radius={[8, 8, 0, 0]}>
                  {bankChartData.map((entry, index) => (
                    <Cell
                      key={`bank-cell-${index}`}
                      fill={entry.color || METALLIC_PALETTE[index % METALLIC_PALETTE.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Multi-Month Cashflow Projections */}
        <div className="lg:col-span-2 metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  Proyección Multi-Mes: Ingresos vs Gastos vs Saldo Remanente
                </h3>
                <p className="text-xs text-metal-400">
                  Compara la evolución de tu sueldo frente a los gastos fijos y tu margen de ahorro.
                </p>
              </div>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={monthlyTrendsData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend formatter={(value) => <span className="text-metal-300 text-xs font-semibold">{value}</span>} />
                <Bar dataKey="Ingreso" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={28} />
                <Bar dataKey="Gastos" fill="#f43f5e" radius={[6, 6, 0, 0]} barSize={28} />
                <Area type="monotone" dataKey="Saldo" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSaldo)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
