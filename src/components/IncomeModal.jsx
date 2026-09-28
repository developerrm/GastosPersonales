import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { getMonthName, formatMoney } from '../utils/formatters';

export const IncomeModal = ({
  isOpen,
  onClose,
  selectedMonth,
  incomes,
  onSaveIncome
}) => {
  const currentIncome = incomes[selectedMonth] || { baseSalary: 1000, extraIncome: 0, notes: '' };

  const [baseSalary, setBaseSalary] = useState(currentIncome.baseSalary || 1000);
  const [extraIncome, setExtraIncome] = useState(currentIncome.extraIncome || 0);
  const [notes, setNotes] = useState(currentIncome.notes || '');

  useEffect(() => {
    const inc = incomes[selectedMonth] || { baseSalary: 1000, extraIncome: 0, notes: '' };
    setBaseSalary(inc.baseSalary);
    setExtraIncome(inc.extraIncome);
    setNotes(inc.notes || '');
  }, [selectedMonth, incomes, isOpen]);

  if (!isOpen) return null;

  const total = (parseFloat(baseSalary) || 0) + (parseFloat(extraIncome) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveIncome(selectedMonth, {
      baseSalary: parseFloat(baseSalary) || 0,
      extraIncome: parseFloat(extraIncome) || 0,
      notes: notes.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="metallic-card-surface glass-modal w-full max-w-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Ingresos & Sueldo Mensual
              </h2>
              <p className="text-xs text-amber-400/90 font-medium">
                Periodo: {getMonthName(selectedMonth)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-metal-400 hover:text-white hover:bg-metal-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Sueldo Base ($) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-400 font-mono font-bold text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={baseSalary}
                onChange={(e) => setBaseSalary(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-metal-950 border border-white/10 text-white text-base font-mono font-extrabold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Ingresos Extras / Bonos / Freelance ($)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-metal-400 font-mono font-bold text-sm">
                $
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={extraIncome}
                onChange={(e) => setExtraIncome(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-metal-950 border border-white/10 text-white text-base font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Nota / Concepto del Ingreso
            </label>
            <input
              type="text"
              placeholder="Ej. Sueldo quincena + fin de mes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Total Calculation Preview */}
          <div className="bg-metal-950/80 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
            <span className="text-xs font-bold text-metal-300">Total Ingresos para {getMonthName(selectedMonth)}:</span>
            <span className="text-lg font-mono font-extrabold text-amber-400">
              {formatMoney(total)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-metal-300 hover:bg-metal-800 border border-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="metallic-btn-gold px-5 py-2 rounded-xl text-xs font-bold"
            >
              Actualizar Sueldo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
