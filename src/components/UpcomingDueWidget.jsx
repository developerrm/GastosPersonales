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
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { getExpenseUrgency } from '../utils/dateHelpers';

export const UpcomingDueWidget = ({
  expenses,
  banks,
  selectedMonth,
  onQuickPay,
  onEditExpense,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [filterState, setFilterState] = useState('pending'); // 'all' | 'pending' | 'urgent' | 'paid'
  const [localCollapsed, setLocalCollapsed] = useState(isCollapsed);

  const collapsed = onToggleCollapse ? isCollapsed : localCollapsed;
  const toggle = () => {
    if (onToggleCollapse) onToggleCollapse();
    else setLocalCollapsed(!localCollapsed);
  };

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

  const pendingCount = enrichedList.filter((i) => !i.isPaid).length;
  const urgentCount = enrichedList.filter((i) => !i.isPaid && (i.urgency.status === 'critical' || i.urgency.status === 'overdue')).length;

  // Render minimal single line banner if collapsed
  if (collapsed) {
    return (
      <div className="metallic-card-surface rounded-2xl p-3 border border-white/10 shadow-sm flex items-center justify-between gap-3 animate-fadeIn">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <Clock className="w-4 h-4" />
          </div>
          <span className="font-bold text-xs text-white">Cronograma de Vencimientos:</span>
          <span className="text-xs text-metal-300">
            {pendingCount === 0 ? (
              <span className="text-emerald-400 font-bold">¡Todos los pagos al día!</span>
            ) : (
              <span>
                <strong className="text-amber-300">{pendingCount}</strong> pendientes
                {urgentCount > 0 && <strong className="text-rose-400 ml-1.5">({urgentCount} urgentes)</strong>}
              </span>
            )}
          </span>
        </div>

        <button
          onClick={toggle}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-metal-300 bg-metal-900 border border-white/10 hover:text-white hover:border-amber-400/40 transition-all"
        >
          <span>Mostrar Cronograma</span>
          <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-metallic">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-accent-glow)',
                color: 'var(--color-accent)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Cronograma & Fechas Máximas de Pago
                <span className="text-xs font-mono font-normal px-2 py-0.5 rounded-full bg-metal-800 text-metal-300 border border-white/5">
                  {filteredList.length} items
                </span>
              </h2>
              <p className="text-xs text-metal-400 hidden sm:block">
                Visualiza qué debes pagar, en qué banco y cuántos días restan para la fecha máxima.
              </p>
            </div>
          </div>

          {/* Quick Collapse Icon on Mobile/Desktop */}
          <button
            onClick={toggle}
            className="p-1.5 rounded-lg text-metal-400 hover:text-white hover:bg-metal-800 transition-all sm:hidden"
            title="Ocultar cronograma"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-metal-950 p-1 rounded-xl border border-white/10 overflow-x-auto">
            <button
              onClick={() => setFilterState('pending')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterState === 'pending'
                  ? 'metallic-btn-gold text-white shadow-sm'
                  : 'text-metal-400 hover:text-white'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              onClick={() => setFilterState('urgent')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterState === 'urgent'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-metal-400 hover:text-white'
              }`}
            >
              Urgentes ({urgentCount})
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

          {/* Desktop Collapse Trigger */}
          <button
            onClick={toggle}
            className="hidden sm:flex items-center gap-1 text-xs text-metal-400 hover:text-amber-400 px-2 py-1.5 rounded-lg transition-colors"
            title="Compactar cronograma"
          >
            <ChevronUp className="w-4 h-4" />
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
                      Día {item.dueDay}
                    </span>
                  </div>
                </div>

                {/* Bottom Row: Actions */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => onEditExpense(item)}
                    className="text-[11px] text-metal-400 hover:text-white transition-colors"
                  >
                    Editar detalle
                  </button>

                  <button
                    onClick={() => onQuickPay(item)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      item.isPaid
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
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
                        <span>Pagar Ahora</span>
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
