import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Copy,
  CreditCard,
  Calendar,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  Tag,
  AlertCircle
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { getExpenseUrgency } from '../utils/dateHelpers';

export const CardsView = ({
  expenses,
  banks,
  categories,
  selectedMonth,
  onOpenExpenseModal,
  onEditExpense,
  onDeleteExpense,
  onDuplicateExpense,
  onQuickPay
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bankFilter, setBankFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBank = bankFilter === 'all' || exp.bankId === bankFilter;
    const matchesCat = categoryFilter === 'all' || exp.categoryId === categoryFilter;

    const payment = exp.monthlyPayments?.[selectedMonth];
    const isPaid = payment?.status === 'paid';
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'paid' && isPaid) ||
      (statusFilter === 'pending' && !isPaid);

    return matchesSearch && matchesBank && matchesCat && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filter Header */}
      <div className="metallic-card-surface rounded-2xl p-4 border border-white/10 shadow-metallic flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, banco o nota..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-metal-950/80 border border-white/10 text-white placeholder-metal-500 text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-metal-300 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todos los Estados</option>
            <option value="pending">Solo Pendientes</option>
            <option value="paid">Solo Pagados</option>
          </select>

          {/* Bank Filter */}
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
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
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-metal-300 text-xs focus:outline-none focus:border-amber-400"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Add New Expense Button */}
          <button
            onClick={onOpenExpenseModal}
            className="metallic-btn-gold px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Nuevo</span>
          </button>
        </div>
      </div>

      {/* Expenses Grid */}
      {filteredExpenses.length === 0 ? (
        <div className="metallic-card-surface rounded-2xl p-12 text-center border border-white/10">
          <AlertCircle className="w-12 h-12 text-amber-400/50 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No se encontraron gastos</h3>
          <p className="text-xs text-metal-400 mb-4">
            No hay gastos que coincidan con los filtros seleccionados o aún no has creado ninguno.
          </p>
          <button
            onClick={onOpenExpenseModal}
            className="metallic-btn-gold px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Crear Primer Gasto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExpenses.map((exp) => {
            const bank = banks.find((b) => b.id === exp.bankId) || {
              name: 'Banco',
              shortName: 'Banco',
              badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
            };
            const category = categories.find((c) => c.id === exp.categoryId) || {
              name: 'General',
              color: '#94a3b8'
            };

            const payment = exp.monthlyPayments?.[selectedMonth];
            const amount = payment?.amount !== undefined ? Number(payment.amount) : Number(exp.estimatedAmount);
            const isPaid = payment?.status === 'paid';
            const urgency = getExpenseUrgency(exp, selectedMonth);

            return (
              <div
                key={exp.id}
                className={`metallic-card-surface rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between group ${
                  isPaid
                    ? 'border-emerald-500/30 bg-metal-950/70'
                    : urgency.status === 'critical' || urgency.status === 'overdue'
                    ? 'border-rose-500/40 shadow-metallic-glow-ruby'
                    : 'border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  {/* Top Badges: Bank & Category */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${bank.badgeClass}`}>
                      {bank.name}
                    </span>
                    <span className="text-[11px] font-semibold text-metal-400 bg-metal-900 px-2.5 py-0.5 rounded-full border border-white/5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-400" />
                      {category.name}
                    </span>
                  </div>

                  {/* Main Title & Urgency */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-extrabold text-base text-white tracking-tight">
                      {exp.name}
                    </h3>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${urgency.badgeClass}`}>
                      {urgency.label}
                    </span>
                  </div>

                  {/* Notes / Subtitle */}
                  {exp.notes && (
                    <p className="text-xs text-metal-400 mb-3 line-clamp-2">
                      {exp.notes}
                    </p>
                  )}

                  {/* Schedule Details Box */}
                  <div className="bg-metal-950/80 rounded-xl p-3 border border-white/5 mb-4 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-metal-400 block font-medium">
                        Fecha de Corte:
                      </span>
                      <span className="font-bold text-metal-200">
                        Día {exp.billingDay}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-metal-400 block font-medium">
                        Fecha Máxima de Pago:
                      </span>
                      <span className="font-extrabold text-amber-300">
                        Día {exp.dueDay}
                      </span>
                    </div>
                  </div>

                  {/* Financial Amounts Box */}
                  <div className="flex items-end justify-between p-3 rounded-xl bg-metal-900/60 border border-white/5 mb-4">
                    <div>
                      <span className="text-[10px] text-metal-400 block">Estimado Base:</span>
                      <span className="text-xs font-mono text-metal-400">
                        {formatMoney(exp.estimatedAmount)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-metal-400 block">Monto Este Mes:</span>
                      <span className={`text-lg font-mono font-extrabold ${isPaid ? 'text-emerald-400' : 'text-white'}`}>
                        {formatMoney(amount)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditExpense(exp)}
                      className="p-2 rounded-xl text-metal-400 hover:text-amber-400 hover:bg-metal-800 transition-all"
                      title="Editar datos del gasto"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDuplicateExpense(exp)}
                      className="p-2 rounded-xl text-metal-400 hover:text-sky-400 hover:bg-metal-800 transition-all"
                      title="Duplicar gasto"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteExpense(exp.id)}
                      className="p-2 rounded-xl text-metal-400 hover:text-rose-400 hover:bg-metal-800 transition-all"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Primary Pay Button */}
                  <button
                    onClick={() => onQuickPay(exp)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isPaid
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'metallic-btn-gold text-white shadow-metallic-glow-gold'
                    }`}
                  >
                    {isPaid ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pagado</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Registrar Pago</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
