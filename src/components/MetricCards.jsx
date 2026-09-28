import React from 'react';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  PiggyBank,
  Edit2,
  Clock,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { formatMoney, formatPercent } from '../utils/formatters';
import { getExpenseUrgency } from '../utils/dateHelpers';

export const MetricCards = ({
  expenses,
  incomes,
  selectedMonth,
  banks,
  onOpenIncomeModal,
  onSelectExpense
}) => {
  // Current month income
  const monthIncomeObj = incomes[selectedMonth] || { baseSalary: 1000, extraIncome: 0 };
  const totalIncome = (Number(monthIncomeObj.baseSalary) || 0) + (Number(monthIncomeObj.extraIncome) || 0);

  // Calculate expenses stats for this month
  let totalEstimated = 0;
  let totalMonthAmount = 0;
  let totalPaidAmount = 0;
  let totalPendingAmount = 0;
  let paidCount = 0;
  let pendingCount = 0;

  expenses.forEach((exp) => {
    totalEstimated += Number(exp.estimatedAmount) || 0;
    const payment = exp.monthlyPayments?.[selectedMonth];
    const amount = payment?.amount !== undefined && payment.amount !== null ? Number(payment.amount) : Number(exp.estimatedAmount);
    
    totalMonthAmount += amount;

    if (payment?.status === 'paid') {
      totalPaidAmount += amount;
      paidCount++;
    } else {
      totalPendingAmount += amount;
      pendingCount++;
    }
  });

  const remainingBalance = totalIncome - totalMonthAmount;
  const percentPaid = totalMonthAmount > 0 ? (totalPaidAmount / totalMonthAmount) * 100 : 0;

  // Find next nearest unpaid expense
  const unpaidExpenses = expenses
    .filter((e) => e.monthlyPayments?.[selectedMonth]?.status !== 'paid')
    .map((e) => ({
      ...e,
      urgency: getExpenseUrgency(e, selectedMonth)
    }))
    .sort((a, b) => a.urgency.daysLeft - b.urgency.daysLeft);

  const nearestExpense = unpaidExpenses[0];
  const nearestBank = nearestExpense ? banks.find((b) => b.id === nearestExpense.bankId) : null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Sueldo / Ingreso Mensual */}
      <div className="metallic-card-surface rounded-2xl p-4 metallic-card-interactive group border-l-4 border-l-amber-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
            Sueldo / Ingresos
          </span>
          <button
            onClick={onOpenIncomeModal}
            className="p-1 rounded-lg text-metal-400 hover:text-amber-400 hover:bg-amber-500/10 transition-all opacity-80 group-hover:opacity-100"
            title="Editar ingresos del mes"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
          {formatMoney(totalIncome)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-metal-400">
          <span className="flex items-center gap-1 text-amber-400/90 font-medium">
            <DollarSign className="w-3.5 h-3.5" /> Base: {formatMoney(monthIncomeObj.baseSalary || 0)}
          </span>
          {Number(monthIncomeObj.extraIncome) > 0 && (
            <span className="text-emerald-400 text-[11px] font-mono">
              +{formatMoney(monthIncomeObj.extraIncome)}
            </span>
          )}
        </div>
      </div>

      {/* 2. Total Gastos del Mes */}
      <div className="metallic-card-surface rounded-2xl p-4 metallic-card-interactive border-l-4 border-l-rose-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
            Gastos Totales
          </span>
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
          {formatMoney(totalMonthAmount)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-metal-400">
          <span>{expenses.length} gastos fijos</span>
          <span className="text-metal-400 text-[11px]">
            Est. {formatMoney(totalEstimated)}
          </span>
        </div>
      </div>

      {/* 3. Progreso de Pagos */}
      <div className="metallic-card-surface rounded-2xl p-4 metallic-card-interactive border-l-4 border-l-sky-500">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
            Progreso Pagado
          </span>
          <span className="text-xs font-mono font-bold text-sky-400">
            {formatPercent(percentPaid)}
          </span>
        </div>
        <div className="text-2xl font-extrabold text-white tracking-tight font-mono">
          {formatMoney(totalPaidAmount)}
        </div>
        {/* Metallic progress bar */}
        <div className="mt-2 space-y-1">
          <div className="w-full bg-metal-950 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 transition-all duration-500 shadow-sm"
              style={{ width: `${Math.min(percentPaid, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-metal-400 font-mono">
            <span>Pagados: {paidCount}</span>
            <span className="text-amber-400">Pendiente: {formatMoney(totalPendingAmount)}</span>
          </div>
        </div>
      </div>

      {/* 4. Saldo Remanente / Ahorro Proyectado */}
      <div
        className={`metallic-card-surface rounded-2xl p-4 metallic-card-interactive border-l-4 ${
          remainingBalance >= 0 ? 'border-l-emerald-500' : 'border-l-red-600'
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
            Saldo Restante
          </span>
          <div
            className={`p-1.5 rounded-lg ${
              remainingBalance >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
            }`}
          >
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <div
          className={`text-2xl font-extrabold tracking-tight font-mono ${
            remainingBalance >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {formatMoney(remainingBalance)}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-metal-400">
          <span>{remainingBalance >= 0 ? 'Excedente libre' : 'Déficit del mes'}</span>
          <span className="text-[11px] font-mono text-metal-400">
            {((remainingBalance / (totalIncome || 1)) * 100).toFixed(0)}% de ingresos
          </span>
        </div>
      </div>

      {/* 5. Próximo Vencimiento Crítico */}
      <div className="metallic-card-surface rounded-2xl p-4 metallic-card-interactive border-l-4 border-l-amber-400">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-bold text-metal-400 uppercase tracking-wider">
            Próximo Pago
          </span>
          <Clock className="w-4 h-4 text-amber-400" />
        </div>
        {nearestExpense ? (
          <div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white truncate max-w-[120px]">
                {nearestExpense.name}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${nearestExpense.urgency.badgeClass}`}>
                {nearestExpense.urgency.label}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-metal-400">
              <span className="font-mono text-white font-bold">
                {formatMoney(
                  nearestExpense.monthlyPayments?.[selectedMonth]?.amount ||
                  nearestExpense.estimatedAmount
                )}
              </span>
              <span className="text-[11px] text-metal-300 truncate max-w-[90px]">
                {nearestBank?.shortName || nearestBank?.name || 'Banco'}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 text-center">
            <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
            <span className="text-xs font-bold text-emerald-300">¡Todo al día!</span>
            <span className="text-[10px] text-metal-400">Sin pagos pendientes este mes</span>
          </div>
        )}
      </div>
    </div>
  );
};
