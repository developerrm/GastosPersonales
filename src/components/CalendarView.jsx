import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign
} from 'lucide-react';
import { getMonthName, formatMoney } from '../utils/formatters';
import { getMonthCalendarGrid } from '../utils/dateHelpers';

export const CalendarView = ({
  expenses,
  banks,
  selectedMonth,
  onQuickPay,
  onEditExpense
}) => {
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);

  const daysGrid = getMonthCalendarGrid(selectedMonth);
  const weekDayHeaders = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Map expenses to their due days and billing days for this month
  const dueDaysMap = {};
  const billingDaysMap = {};

  expenses.forEach((exp) => {
    const due = exp.dueDay || 1;
    const bill = exp.billingDay || 1;
    const bank = banks.find((b) => b.id === exp.bankId) || { name: 'Banco', color: '#f59e0b' };
    const payment = exp.monthlyPayments?.[selectedMonth];
    const amount = payment?.amount !== undefined ? Number(payment.amount) : Number(exp.estimatedAmount);
    const isPaid = payment?.status === 'paid';

    const item = { ...exp, bank, amount, isPaid };

    if (!dueDaysMap[due]) dueDaysMap[due] = [];
    dueDaysMap[due].push(item);

    if (!billingDaysMap[bill]) billingDaysMap[bill] = [];
    billingDaysMap[bill].push(item);
  });

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="metallic-card-surface rounded-2xl p-4 border border-white/10 shadow-metallic flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Calendario de Vencimientos & Fechas de Corte
            </h2>
            <p className="text-xs text-metal-400">
              Visualiza en qué días del mes caen los cortes y los pagos límites.
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-metal-300">Fecha Máxima de Pago</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span className="text-metal-300">Fecha de Corte</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Main 7-Column Calendar Grid */}
        <div className="lg:col-span-2 metallic-card-surface rounded-2xl p-4 border border-white/10 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
            {weekDayHeaders.map((day) => (
              <div
                key={day}
                className="text-center py-1.5 text-xs font-bold text-metal-400 uppercase tracking-wider bg-metal-950/60 rounded-lg border border-white/5"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {daysGrid.map((cell, idx) => {
              if (cell.isPadding) {
                return (
                  <div
                    key={`pad-${idx}`}
                    className="min-h-[75px] sm:min-h-[90px] bg-metal-950/30 rounded-xl border border-white/[0.02]"
                  />
                );
              }

              const day = cell.dayNumber;
              const dueItems = dueDaysMap[day] || [];
              const billingItems = billingDaysMap[day] || [];
              const hasEvents = dueItems.length > 0 || billingItems.length > 0;
              const hasUnpaidDue = dueItems.some((i) => !i.isPaid);

              return (
                <div
                  key={`day-${day}`}
                  onClick={() => setSelectedDayDetails({ day, dueItems, billingItems })}
                  className={`min-h-[75px] sm:min-h-[95px] p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    hasUnpaidDue
                      ? 'bg-gradient-to-b from-metal-900 via-amber-950/20 to-metal-950 border-amber-500/40 shadow-sm hover:border-amber-400'
                      : hasEvents
                      ? 'bg-metal-900/80 border-white/15 hover:border-white/30'
                      : 'bg-metal-950/50 border-white/5 hover:bg-metal-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-bold ${
                        hasUnpaidDue
                          ? 'text-amber-300 font-extrabold'
                          : 'text-metal-300'
                      }`}
                    >
                      {day}
                    </span>

                    {dueItems.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    )}
                  </div>

                  {/* Badges / Dots in Calendar Cell */}
                  <div className="space-y-1 mt-1">
                    {dueItems.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className={`text-[9px] font-bold px-1 py-0.5 rounded truncate border ${
                          item.isPaid
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-200 border-amber-500/40'
                        }`}
                      >
                        {item.name}
                      </div>
                    ))}
                    {dueItems.length > 2 && (
                      <span className="text-[9px] text-metal-400 block text-right font-mono">
                        +{dueItems.length - 2} más
                      </span>
                    )}

                    {billingItems.length > 0 && dueItems.length === 0 && (
                      <div className="text-[9px] text-sky-300 bg-sky-500/10 px-1 py-0.5 rounded truncate border border-sky-500/20">
                        Corte: {billingItems[0].name}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details Panel */}
        <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                {selectedDayDetails ? `Detalle Día ${selectedDayDetails.day}` : 'Selecciona un día'}
              </h3>
              <span className="text-xs text-metal-400 font-mono">
                {getMonthName(selectedMonth)}
              </span>
            </div>

            {selectedDayDetails && (selectedDayDetails.dueItems.length > 0 || selectedDayDetails.billingItems.length > 0) ? (
              <div className="space-y-3">
                {/* Due Items on this day */}
                {selectedDayDetails.dueItems.length > 0 && (
                  <div>
                    <span className="text-[11px] font-extrabold uppercase text-amber-400 tracking-wider block mb-2">
                      Pagos Máximos para el Día {selectedDayDetails.day}:
                    </span>
                    <div className="space-y-2">
                      {selectedDayDetails.dueItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-metal-950/80 rounded-xl p-3 border border-white/10 flex items-center justify-between gap-2"
                        >
                          <div>
                            <span className="font-bold text-white text-xs block">
                              {item.name}
                            </span>
                            <span className="text-[10px] text-metal-400">
                              {item.bank.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-white">
                              {formatMoney(item.amount)}
                            </span>
                            <button
                              onClick={() => onQuickPay(item)}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                                item.isPaid
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'metallic-btn-gold text-white'
                              }`}
                            >
                              {item.isPaid ? 'Pagado' : 'Pagar'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Billing Items on this day */}
                {selectedDayDetails.billingItems.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-extrabold uppercase text-sky-400 tracking-wider block mb-2">
                      Fechas de Corte / Emisión:
                    </span>
                    <div className="space-y-2">
                      {selectedDayDetails.billingItems.map((item) => (
                        <div
                          key={`bill-${item.id}`}
                          className="bg-metal-950/80 rounded-xl p-2.5 border border-sky-500/20 text-xs flex items-center justify-between"
                        >
                          <span className="text-metal-200 font-semibold">{item.name}</span>
                          <span className="text-sky-400 text-[11px]">Corte de facturación</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-metal-400 space-y-2">
                <CalendarIcon className="w-8 h-8 mx-auto text-metal-600" />
                <p className="text-xs">
                  {selectedDayDetails
                    ? 'No hay vencimientos ni cortes registrados para este día.'
                    : 'Haz clic en cualquier día del calendario para ver los vencimientos asociados.'}
                </p>
              </div>
            )}
          </div>

          {/* Quick summary footer */}
          <div className="pt-4 border-t border-white/10 text-[11px] text-metal-400 flex items-center justify-between">
            <span>Gastos fijos totales: {expenses.length}</span>
            <span className="text-amber-400 font-mono">
              Total Mes: {formatMoney(expenses.reduce((sum, e) => sum + (e.monthlyPayments?.[selectedMonth]?.amount || e.estimatedAmount), 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
