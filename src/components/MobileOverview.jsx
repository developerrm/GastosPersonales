import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Plus,
  Wallet
} from 'lucide-react';
import { MonthSelector } from './MonthSelector';
import { formatMoney, getMonthName } from '../utils/formatters';

export const MobileOverview = ({
  user,
  expenses,
  incomes,
  selectedMonth,
  setSelectedMonth,
  months,
  onAddNewMonth,
  onAddExpense
}) => {
  const monthIncome = incomes[selectedMonth] || {};
  const totalIncome = (Number(monthIncome.baseSalary) || 0) + (Number(monthIncome.extraIncome) || 0);
  const totalExpenses = expenses.reduce((total, expense) => {
    const payment = expense.monthlyPayments?.[selectedMonth];
    const amount = payment?.amount !== undefined && payment?.amount !== null
      ? Number(payment.amount)
      : Number(expense.estimatedAmount) || 0;
    return total + amount;
  }, 0);
  const balance = totalIncome - totalExpenses;
  const availablePercent = totalIncome ? (balance / totalIncome) * 100 : 0;
  const userName = user?.name?.trim() || user?.given_name || user?.email?.split('@')[0] || 'usuario';
  const period = getMonthName(selectedMonth);
  const BalanceIcon = balance >= 0 ? ArrowUpRight : ArrowDownRight;

  return (
    <section className="space-y-5 md:hidden" aria-label="Resumen del periodo">
      <div className="pt-1">
        <p className="text-sm font-medium text-metal-400">Buenos días,</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-metal-50">
          {userName}
        </h1>
        <p className="mt-1 text-sm text-metal-400">Este es el resumen de tus gastos fijos.</p>
      </div>

      <MonthSelector
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        months={months}
        onAddNewMonth={onAddNewMonth}
      />

      <article className="rounded-3xl border border-white/10 bg-metal-900/90 p-5 shadow-xl shadow-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-metal-300">
            <Wallet className="h-4 w-4 text-amber-400" aria-hidden="true" />
            Saldo total
          </div>
          <span className="rounded-full border border-white/10 bg-metal-950/70 px-2.5 py-1 text-xs font-medium text-metal-300">
            {period}
          </span>
        </div>
        <p className="mt-5 text-3xl font-extrabold tracking-tight text-metal-50">
          {formatMoney(balance)}
        </p>
        <div className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold ${balance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          <BalanceIcon className="h-4 w-4" aria-hidden="true" />
          <span>{availablePercent.toFixed(1)}% disponible sobre tus ingresos</span>
        </div>
        <p className="mt-1 text-xs text-metal-400">Después de cubrir tus gastos del periodo</p>
      </article>

      <div className="grid grid-cols-2 gap-3">
        <article className="rounded-2xl border border-white/10 bg-metal-900/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-metal-400">
            <ArrowDownRight className="h-4 w-4 text-emerald-400" aria-hidden="true" />
            Ingresos
          </div>
          <p className="mt-3 text-lg font-bold tracking-tight text-metal-50">{formatMoney(totalIncome)}</p>
          <p className="mt-1 text-xs text-metal-400">En {period}</p>
        </article>
        <article className="rounded-2xl border border-white/10 bg-metal-900/70 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-metal-400">
            <CalendarDays className="h-4 w-4 text-amber-400" aria-hidden="true" />
            Gastos
          </div>
          <p className="mt-3 text-lg font-bold tracking-tight text-metal-50">{formatMoney(totalExpenses)}</p>
          <p className="mt-1 text-xs text-metal-400">{expenses.length} gastos fijos</p>
        </article>
      </div>

      <button
        type="button"
        onClick={onAddExpense}
        className="metallic-btn-gold flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold shadow-lg"
      >
        <Plus className="h-5 w-5" aria-hidden="true" />
        Añadir un gasto
      </button>
    </section>
  );
};
