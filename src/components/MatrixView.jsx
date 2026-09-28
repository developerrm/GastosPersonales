import React, { useState } from 'react';
import {
  Table as TableIcon,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Plus,
  Edit2,
  Trash2,
  Download,
  DollarSign,
  AlertCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';

export const MatrixView = ({
  expenses,
  incomes,
  months,
  banks,
  categories,
  onUpdatePayment,
  onOpenExpenseModal,
  onEditExpense,
  onDeleteExpense,
  onOpenIncomeModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBankFilter, setSelectedBankFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [editingCell, setEditingCell] = useState(null); // { expId, monthKey, value }

  // Filtered expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBank = selectedBankFilter === 'all' || exp.bankId === selectedBankFilter;
    const matchesCat = selectedCategoryFilter === 'all' || exp.categoryId === selectedCategoryFilter;
    return matchesSearch && matchesBank && matchesCat;
  });

  // Calculate Column Totals for each month
  const monthTotals = {};
  const monthIncomes = {};
  const monthBalances = {};

  let totalEstimatedSum = 0;
  expenses.forEach((e) => {
    totalEstimatedSum += Number(e.estimatedAmount) || 0;
  });

  months.forEach((m) => {
    const mKey = m.key;
    const incObj = incomes[mKey] || { baseSalary: 1000, extraIncome: 0 };
    const incTotal = (Number(incObj.baseSalary) || 0) + (Number(incObj.extraIncome) || 0);
    monthIncomes[mKey] = incTotal;

    let totalMonthGastos = 0;
    expenses.forEach((e) => {
      const payment = e.monthlyPayments?.[mKey];
      const val = payment?.amount !== undefined && payment.amount !== null
        ? Number(payment.amount)
        : Number(e.estimatedAmount);
      totalMonthGastos += val;
    });

    monthTotals[mKey] = totalMonthGastos;
    monthBalances[mKey] = incTotal - totalMonthGastos;
  });

  // Handle cell edit save
  const handleCellBlur = (expId, monthKey, value) => {
    const num = parseFloat(value);
    const validAmount = isNaN(num) ? 0 : num;
    const currentStatus = expenses.find((e) => e.id === expId)?.monthlyPayments?.[monthKey]?.status || 'pending';

    onUpdatePayment(expId, monthKey, {
      amount: validAmount,
      status: currentStatus
    });
    setEditingCell(null);
  };

  const togglePaymentStatus = (exp, monthKey) => {
    const current = exp.monthlyPayments?.[monthKey];
    const newStatus = current?.status === 'paid' ? 'pending' : 'paid';
    onUpdatePayment(exp.id, monthKey, {
      amount: current?.amount !== undefined ? current.amount : exp.estimatedAmount,
      status: newStatus,
      paidDate: newStatus === 'paid' ? new Date().toISOString().split('T')[0] : null
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="metallic-card-surface rounded-2xl p-4 border border-white/10 shadow-metallic flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-400" />
          <input
            type="text"
            placeholder="Buscar por gasto o nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-metal-950/80 border border-white/10 text-white placeholder-metal-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Bank Filter */}
          <select
            value={selectedBankFilter}
            onChange={(e) => setSelectedBankFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-metal-300 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todos los Bancos</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-metal-300 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Add Expense Shortcut */}
          <button
            onClick={onOpenExpenseModal}
            className="metallic-btn-gold px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Gasto</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Spreadsheet Matrix */}
      <div className="metallic-card-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left matrix-table text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/15">
                <th className="py-3 px-4 text-metal-300 font-extrabold uppercase tracking-wider sticky left-0 z-20 bg-metal-900 min-w-[140px] shadow-r">
                  BANCO
                </th>
                <th className="py-3 px-4 text-metal-300 font-extrabold uppercase tracking-wider sticky left-[140px] z-20 bg-metal-900 min-w-[160px] shadow-r">
                  GASTOS MENSUALES
                </th>
                <th className="py-3 px-3 text-metal-400 font-bold uppercase tracking-wider min-w-[120px] text-center">
                  FECHA EMISIÓN / CORTE
                </th>
                <th className="py-3 px-3 text-metal-400 font-bold uppercase tracking-wider min-w-[120px] text-center">
                  FECHA MÁX PAGO
                </th>
                <th className="py-3 px-4 text-amber-300 font-extrabold uppercase tracking-wider min-w-[110px] text-right bg-amber-500/5">
                  ESTIMADO
                </th>

                {/* Dynamic Month Columns */}
                {months.map((m) => (
                  <th
                    key={m.key}
                    className="py-3 px-3 text-center min-w-[130px] font-extrabold text-white border-l border-white/10 bg-metal-900/90"
                  >
                    <div className="font-bold text-sm tracking-tight">{m.shortLabel || m.label}</div>
                    <div className="text-[10px] text-amber-400/90 font-mono font-normal">
                      Sueldo: {formatMoney(monthIncomes[m.key] || 0)}
                    </div>
                  </th>
                ))}

                <th className="py-3 px-3 text-center min-w-[80px] font-bold text-metal-400">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-mono">
              {filteredExpenses.map((exp) => {
                const bank = banks.find((b) => b.id === exp.bankId) || {
                  name: 'Banco',
                  badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                };

                // Highlight prominent rows (e.g. Internet, Tarjeta) if needed
                const isHighlight = exp.name.toUpperCase().includes('INTERNET') || exp.name.toUpperCase().includes('TARJETA');

                return (
                  <tr
                    key={exp.id}
                    className={`transition-colors ${
                      isHighlight
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-metal-800/40'
                    }`}
                  >
                    {/* Banco */}
                    <td className="py-3 px-4 sticky left-0 z-10 bg-metal-950/95 font-sans">
                      <span className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border ${bank.badgeClass}`}>
                        {bank.shortName || bank.name}
                      </span>
                    </td>

                    {/* Nombre del Gasto */}
                    <td className="py-3 px-4 font-sans sticky left-[140px] z-10 bg-metal-950/95">
                      <div className="font-bold text-white text-xs">{exp.name}</div>
                      {exp.notes && (
                        <div className="text-[10px] text-metal-400 truncate max-w-[150px]">
                          {exp.notes}
                        </div>
                      )}
                    </td>

                    {/* Fecha de Emisión / Corte */}
                    <td className="py-3 px-3 text-center text-metal-300 font-sans text-xs">
                      {exp.billingDay} de cada mes
                    </td>

                    {/* Fecha Máxima de Pago */}
                    <td className="py-3 px-3 text-center font-sans text-xs">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/20">
                        {exp.dueDay} de cada mes
                      </span>
                    </td>

                    {/* Estimado ($) */}
                    <td className="py-3 px-4 text-right font-extrabold text-white bg-amber-500/5">
                      {formatMoney(exp.estimatedAmount)}
                    </td>

                    {/* Monthly Columns */}
                    {months.map((m) => {
                      const mKey = m.key;
                      const payment = exp.monthlyPayments?.[mKey];
                      const amount = payment?.amount !== undefined ? payment.amount : exp.estimatedAmount;
                      const isPaid = payment?.status === 'paid';
                      const isEditing =
                        editingCell && editingCell.expId === exp.id && editingCell.monthKey === mKey;

                      return (
                        <td
                          key={mKey}
                          className="py-2.5 px-2 text-center border-l border-white/5 relative group"
                        >
                          <div className="flex items-center justify-between gap-1">
                            {/* Toggle Paid Button */}
                            <button
                              onClick={() => togglePaymentStatus(exp, mKey)}
                              title={isPaid ? 'Marcado como pagado (clic para desmarcar)' : 'Pendiente (clic para marcar pagado)'}
                              className={`p-1 rounded-md transition-all ${
                                isPaid
                                  ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/10'
                                  : 'text-metal-600 hover:text-amber-400 hover:bg-metal-800'
                              }`}
                            >
                              <CheckCircle2 className={`w-3.5 h-3.5 ${isPaid ? 'fill-emerald-500/20' : ''}`} />
                            </button>

                            {/* Editable Amount Input */}
                            {isEditing ? (
                              <input
                                autoFocus
                                type="number"
                                step="0.01"
                                defaultValue={amount}
                                onBlur={(e) => handleCellBlur(exp.id, mKey, e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleCellBlur(exp.id, mKey, e.target.value);
                                  if (e.key === 'Escape') setEditingCell(null);
                                }}
                                className="w-20 px-1 py-0.5 rounded bg-metal-950 border border-amber-400 text-amber-200 text-right font-mono text-xs focus:outline-none"
                              />
                            ) : (
                              <button
                                onClick={() =>
                                  setEditingCell({ expId: exp.id, monthKey: mKey, value: amount })
                                }
                                title="Clic para editar valor"
                                className={`w-full text-right font-bold transition-all px-1.5 py-0.5 rounded ${
                                  isPaid
                                    ? 'text-emerald-300 bg-emerald-950/20 hover:bg-emerald-900/30'
                                    : amount === 0
                                    ? 'text-metal-500 hover:bg-metal-800'
                                    : 'text-white hover:bg-metal-800 hover:text-amber-300'
                                }`}
                              >
                                {amount === 0 && payment?.note === 'pagado'
                                  ? 'pagado'
                                  : amount === 0
                                  ? '-'
                                  : formatMoney(amount)}
                              </button>
                            )}
                          </div>
                        </td>
                      );
                    })}

                    {/* Acciones */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onEditExpense(exp)}
                          className="p-1 rounded text-metal-400 hover:text-amber-400 hover:bg-metal-800 transition-all"
                          title="Editar gasto"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteExpense(exp.id)}
                          className="p-1 rounded text-metal-400 hover:text-rose-400 hover:bg-metal-800 transition-all"
                          title="Eliminar gasto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {/* 1. TOTAL GASTOS MENSUALES ROW (Red / Crimson Metallic bar like in Excel) */}
              <tr className="bg-gradient-to-r from-red-950 via-rose-900 to-red-950 text-white font-extrabold border-t-2 border-rose-500/50 shadow-lg">
                <td colSpan={4} className="py-3 px-4 font-sans uppercase tracking-wider text-right font-extrabold sticky left-0 z-10 bg-red-950">
                  TOTAL GASTOS MENSUALES:
                </td>
                <td className="py-3 px-4 text-right font-mono text-amber-300 text-sm">
                  {formatMoney(totalEstimatedSum)}
                </td>
                {months.map((m) => (
                  <td key={m.key} className="py-3 px-3 text-right font-mono text-sm border-l border-rose-700/50">
                    {formatMoney(monthTotals[m.key] || 0)}
                  </td>
                ))}
                <td className="py-3 px-3"></td>
              </tr>

              {/* 2. SUELDO / INGRESOS ROW */}
              <tr className="bg-metal-900/90 text-metal-300 border-t border-white/10 font-sans">
                <td colSpan={4} className="py-2.5 px-4 uppercase tracking-wider text-right font-bold text-xs sticky left-0 z-10 bg-metal-900">
                  Sueldo / Ingreso Total:
                </td>
                <td className="py-2.5 px-4 text-right font-mono text-metal-400 text-xs">
                  -
                </td>
                {months.map((m) => (
                  <td key={m.key} className="py-2.5 px-3 text-right font-mono text-xs text-amber-400 font-bold border-l border-white/5">
                    {formatMoney(monthIncomes[m.key] || 0)}
                  </td>
                ))}
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={onOpenIncomeModal}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>

              {/* 3. SALDOS REMANENTES ROW (Green / Emerald Highlight) */}
              <tr className="bg-metal-950 font-extrabold text-white border-t-2 border-emerald-500/40">
                <td colSpan={4} className="py-3 px-4 font-sans uppercase tracking-wider text-right font-extrabold text-sm sticky left-0 z-10 bg-metal-950 text-emerald-400">
                  Saldos Restantes:
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-metal-500">
                  -
                </td>
                {months.map((m) => {
                  const balance = monthBalances[m.key] || 0;
                  return (
                    <td
                      key={m.key}
                      className={`py-3 px-3 text-right font-mono text-sm border-l border-white/10 ${
                        balance >= 0 ? 'text-emerald-400 font-extrabold' : 'text-rose-400 font-extrabold'
                      }`}
                    >
                      {formatMoney(balance)}
                    </td>
                  );
                })}
                <td className="py-3 px-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Footnote & Help Tip */}
      <div className="flex items-center justify-between text-xs text-metal-400 px-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Tip: Haz clic sobre cualquier valor de la tabla para editarlo directamente o en el círculo para alternar estado de pago.</span>
        </div>
        <span>Total de gastos registrados: {filteredExpenses.length}</span>
      </div>
    </div>
  );
};
