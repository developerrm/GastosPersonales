import React, { useState, useEffect } from 'react';
import {
  X,
  CreditCard,
  Building2,
  Calendar,
  DollarSign,
  Tag,
  AlertCircle,
  FileText
} from 'lucide-react';

export const ExpenseModal = ({
  isOpen,
  onClose,
  onSaveExpense,
  editingExpense,
  banks,
  categories
}) => {
  const [formData, setFormData] = useState({
    name: '',
    bankId: banks[0]?.id || '',
    categoryId: categories[0]?.id || '',
    billingDay: 1,
    dueDay: 1,
    estimatedAmount: '',
    priority: 'medium',
    notes: ''
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        name: editingExpense.name || '',
        bankId: editingExpense.bankId || banks[0]?.id || '',
        categoryId: editingExpense.categoryId || categories[0]?.id || '',
        billingDay: editingExpense.billingDay || 1,
        dueDay: editingExpense.dueDay || 1,
        estimatedAmount: editingExpense.estimatedAmount || '',
        priority: editingExpense.priority || 'medium',
        notes: editingExpense.notes || ''
      });
    } else {
      setFormData({
        name: '',
        bankId: banks[0]?.id || '',
        categoryId: categories[0]?.id || '',
        billingDay: 1,
        dueDay: 1,
        estimatedAmount: '',
        priority: 'medium',
        notes: ''
      });
    }
  }, [editingExpense, banks, categories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.estimatedAmount === '') return;

    const expensePayload = {
      ...editingExpense,
      name: formData.name.trim(),
      bankId: formData.bankId,
      categoryId: formData.categoryId,
      billingDay: parseInt(formData.billingDay, 10) || 1,
      dueDay: parseInt(formData.dueDay, 10) || 1,
      estimatedAmount: parseFloat(formData.estimatedAmount) || 0,
      priority: formData.priority,
      notes: formData.notes.trim()
    };

    onSaveExpense(expensePayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="metallic-card-surface glass-modal w-full max-w-lg p-6 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {editingExpense ? 'Editar Gasto Fijo' : 'Nuevo Gasto Fijo'}
              </h2>
              <p className="text-xs text-metal-400">
                Define el monto estimado, fechas de corte y banco asociado.
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
          {/* Gasto Name */}
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Nombre del Gasto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. LUZ, INTERNET, TARJETA VISA, PAPÁ..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-metal-950 border border-white/10 text-white placeholder-metal-600 text-sm focus:outline-none focus:border-amber-400 font-semibold"
            />
          </div>

          {/* Bank & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-metal-300 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                Banco Asociado *
              </label>
              <select
                value={formData.bankId || ''}
                onChange={(e) => setFormData({ ...formData, bankId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="">Sin banco asociado</option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-metal-300 mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-sky-400" />
                Categoría *
              </label>
              <select
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-medium"
              >
                <option value="">Sin categoría</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Days (Cut / Billing & Max Due) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-metal-950/60 p-3 rounded-xl border border-white/5">
            <div>
              <label className="block text-xs font-semibold text-metal-300 mb-1">
                Día de Corte / Emisión
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={formData.billingDay}
                  onChange={(e) => setFormData({ ...formData, billingDay: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-white/10 text-white text-xs text-center font-mono font-bold focus:border-amber-400"
                />
                <span className="text-xs text-metal-400 whitespace-nowrap">de cada mes</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-300 mb-1">
                Fecha Máxima de Pago *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={formData.dueDay}
                  onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-amber-500/40 text-amber-300 text-xs text-center font-mono font-extrabold focus:border-amber-400"
                />
                <span className="text-xs text-metal-400 whitespace-nowrap">de cada mes</span>
              </div>
            </div>
          </div>

          {/* Estimated Amount & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-metal-300 mb-1">
                Monto Estimado Base ($) *
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
                  placeholder="0.00"
                  value={formData.estimatedAmount}
                  onChange={(e) => setFormData({ ...formData, estimatedAmount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-metal-950 border border-white/10 text-white text-sm font-mono font-extrabold focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-metal-300 mb-1">
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-metal-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="high">Alta (Imprescindible / Deuda)</option>
                <option value="medium">Media (Servicios / Familia)</option>
                <option value="low">Baja (Opcional / Flexible)</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Notas / Descripción Adicional
            </label>
            <textarea
              rows="2"
              placeholder="Detalles sobre número de contrato, tarjeta, o acuerdo de pago..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 placeholder-metal-600"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
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
              {editingExpense ? 'Guardar Cambios' : 'Crear Gasto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
