import React, { useState } from 'react';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building2,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { getExpenseUrgency } from '../utils/dateHelpers';

export const UpcomingDueWidget = ({
  expenses,
  banks,
  selectedMonth,
  onQuickPay,
  onEditExpense
}) => {
  const [filterState, setFilterState] = useState('pending'); // 'all' | 'pending' | 'urgent' | 'paid'

  // Enrich expenses with bank and urgency
  const enrichedList = expenses.map((exp) => {
    const bank = banks.find((b) => b.id === exp.bankId) || {
      name: 'Banco',
      shortName: 'Banco',
      badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
    };
    const payment = exp.monthlyPayments?.[selectedMonth];
    const amount = payment?.amount !== undefined ? Number(payment.amount) : Number(exp.estimatedAmount);
    const urgency = getExpenseUrgency(exp, selectedMonth);

    return {
      ...exp,
      bank,
      payment,
      monthAmount: amount,
      isPaid: payment?.status === 'paid',
      urgency
    };
  });

  // Sort by urgency / due day
  enrichedList.sort((a, b) => {
    // Paid items at the bottom
    if (a.isPaid && !b.isPaid) return 1;
    if (!a.isPaid && b.isPaid) return -1;
    return a.dueDay - b.dueDay;
  });

  // Filter list
  const filteredList = enrichedList.filter((item) => {
    if (filterState === 'pending') return !item.isPaid;
    if (filterState === 'paid') return item.isPaid;
    if (filterState === 'urgent') return !item.isPaid && (item.urgency.status === 'critical' || item.urgency.status === 'overdue');
    return true;
  });

  return (
    <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-metallic">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Cronograma & Fechas Máximas de Pago
              <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-metal-800 text-metal-300 border border-white/5">
                {filteredList.length} items
              </span>
            </h2>
            <p className="text-xs text-metal-400">
              Visualiza qué debes pagar, en qué banco y cuántos días restan para la fecha máxima.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-metal-950 p-1 rounded-xl border border-white/10 self-stretch sm:self-auto overflow-x-auto">
          <button
            onClick={() => setFilterState('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterState === 'pending'
                ? 'metallic-btn-gold text-white shadow-sm'
                : 'text-metal-400 hover:text-white'
            }`}
          >
            Pendientes ({enrichedList.filter((i) => !i.isPaid).length})
          </button>
          <button
            onClick={() => setFilterState('urgent')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterState === 'urgent'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-metal-400 hover:text-white'
            }`}
          >
            Urgentes ({enrichedList.filter((i) => !i.isPaid && (i.urgency.status === 'critical' || i.urgency.status === 'overdue')).length})
          </button>
          <button
            onClick={() => setFilterState('paid')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterState === 'paid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-metal-400 hover:text-white'
            }`}
          >
            Pagados ({enrichedList.filter((i) => i.isPaid).length})
          </button>
          <button
            onClick={() => setFilterState('all')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              filterState === 'all'
                ? 'metallic-btn-silver text-white'
                : 'text-metal-400 hover:text-white'
            }`}
          >
            Todos ({enrichedList.length})
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {filteredList.length === 0 ? (
        <div className="py-8 text-center bg-metal-950/40 rounded-xl border border-white/5">
          <CheckCircle2 className="w-10 h-10 text-emerald-400/60 mx-auto mb-2" />
          <p className="text-sm font-semibold text-metal-300">No hay gastos para este filtro</p>
          <p className="text-xs text-metal-400">Todos los pagos bajo esta categoría están cubiertos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredList.map((item) => {
            return (
              <div
                key={item.id}
                className={`relative rounded-xl p-3.5 border transition-all duration-200 ${
                  item.isPaid
                    ? 'bg-metal-900/40 border-emerald-500/20 opacity-85'
                    : item.urgency.status === 'critical' || item.urgency.status === 'overdue'
                    ? 'bg-gradient-to-br from-rose-950/40 via-metal-900/80 to-metal-900/90 border-rose-500/40 shadow-metallic-glow-ruby'
                    : 'bg-metal-900/70 border-white/10 hover:border-white/20'
                }`}
              >
                {/* Top Row: Name, Bank, Urgency Badge */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-extrabold text-sm text-white block">
                      {item.name}
                    </span>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border mt-1 ${item.bank.badgeClass}`}>
                      {item.bank.name}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.urgency.badgeClass}`}>
                      {item.urgency.label}
                    </span>
                    <span className="block font-mono font-extrabold text-base text-white mt-1">
                      {formatMoney(item.monthAmount)}
                    </span>
                  </div>
                </div>

                {/* Middle Row: Dates Detail */}
                <div className="bg-metal-950/60 rounded-lg p-2 my-2 border border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-metal-400 block uppercase">Día de Corte:</span>
                    <span className="font-semibold text-metal-200">
                      {item.billingDay} de cada mes
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-metal-400 block uppercase">Máximo Pago:</span>
                    <span className="font-bold text-amber-300">
                      {item.dueDay} de cada mes
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-metal-400 truncate max-w-[130px]">
                    {item.payment?.note || item.notes || 'Gasto fijo'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onQuickPay(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                        item.isPaid
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                          : 'metallic-btn-gold text-white shadow-sm'
                      }`}
                    >
                      {item.isPaid ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Pagado</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Pagar</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
