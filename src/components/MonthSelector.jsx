import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getMonthName } from '../utils/formatters';

export const MonthSelector = ({
  selectedMonth,
  setSelectedMonth,
  months,
  onAddNewMonth
}) => {
  const [showAddMonthModal, setShowAddMonthModal] = useState(false);
  const [newMonthInput, setNewMonthInput] = useState('');

  const currentIndex = months.findIndex((m) => m.key === selectedMonth);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedMonth(months[currentIndex - 1].key);
    }
  };

  const handleNext = () => {
    if (currentIndex < months.length - 1) {
      setSelectedMonth(months[currentIndex + 1].key);
    }
  };

  const handleAddMonthSubmit = (e) => {
    e.preventDefault();
    if (!newMonthInput) return;
    const [year, month] = newMonthInput.split('-');
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const fullNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mIdx = parseInt(month, 10) - 1;

    const newMonthObj = {
      key: newMonthInput,
      label: `${fullNames[mIdx]} ${year}`,
      shortLabel: `${monthNames[mIdx]} ${year.slice(-2)}`,
      income: 1000
    };

    onAddNewMonth(newMonthObj);
    setSelectedMonth(newMonthInput);
    setShowAddMonthModal(false);
    setNewMonthInput('');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-metal-900/60 p-3 rounded-2xl border border-white/5 shadow-inner">
      {/* Active Month Header with Arrows */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-metal-400 font-bold block">
              Periodo Seleccionado
            </span>
            <span className="text-base font-extrabold text-white">
              {getMonthName(selectedMonth)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-metal-950 p-1 rounded-xl border border-white/10">
          <button
            onClick={handlePrev}
            disabled={currentIndex <= 0}
            className="p-1.5 rounded-lg text-metal-300 hover:text-white hover:bg-metal-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Mes anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex >= months.length - 1}
            className="p-1.5 rounded-lg text-metal-300 hover:text-white hover:bg-metal-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Mes siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Month Pills Slider */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
        {months.map((m) => {
          const isSelected = m.key === selectedMonth;
          return (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                isSelected
                  ? 'metallic-btn-gold text-white shadow-metallic-glow-gold'
                  : 'bg-metal-950/80 text-metal-400 border-white/5 hover:text-metal-200 hover:border-white/15'
              }`}
            >
              {m.shortLabel || m.label}
            </button>
          );
        })}

        {/* Add New Month Button */}
        <button
          onClick={() => setShowAddMonthModal(true)}
          title="Agregar nuevo mes a la proyección"
          className="p-1.5 rounded-xl text-metal-400 bg-metal-950/80 border border-dashed border-metal-600 hover:border-amber-400 hover:text-amber-400 transition-all flex items-center gap-1 px-2.5 text-xs font-semibold whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Mes</span>
        </button>
      </div>

      {/* Quick Add Month Modal */}
      {showAddMonthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="metallic-card-surface glass-modal w-full max-w-sm p-6 rounded-2xl border border-white/20 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Agregar Nuevo Mes
            </h3>
            <p className="text-xs text-metal-400 mb-4">
              Selecciona el mes y año para extender tu tabla de proyecciones financieras.
            </p>

            <form onSubmit={handleAddMonthSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-metal-300 mb-1">
                  Mes y Año (YYYY-MM)
                </label>
                <input
                  type="month"
                  required
                  value={newMonthInput}
                  onChange={(e) => setNewMonthInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white focus:outline-none focus:border-amber-400 text-sm font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMonthModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-metal-300 hover:bg-metal-800 border border-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="metallic-btn-gold px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Agregar Mes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
