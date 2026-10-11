import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CreditCard,
  CheckCircle2,
  Calendar,
  DollarSign,
  FileText,
  Sparkles
} from 'lucide-react';
import { formatMoney, getMonthName } from '../utils/formatters';

export const QuickPayModal = ({
  isOpen,
  onClose,
  expense,
  selectedMonth,
  banks,
  onSavePayment
}) => {
  if (!isOpen || !expense) return null;

  const currentPayment = expense.monthlyPayments?.[selectedMonth] || {};
  const initialAmount = currentPayment.amount != null ? currentPayment.amount : expense.estimatedAmount;
  const initialStatus = currentPayment.status || 'paid';
  const initialDate = currentPayment.paidDate || new Date().toISOString().split('T')[0];

  const [amount, setAmount] = useState(initialAmount);
  const [status, setStatus] = useState(initialStatus === 'pending' ? 'paid' : initialStatus);
  const [paidDate, setPaidDate] = useState(initialDate);
  const [note, setNote] = useState(currentPayment.note || '');

  const bank = banks.find((b) => b.id === expense.bankId) || { name: 'Banco' };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#38bdf8', '#10b981', '#f43f5e', '#ffffff']
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const paymentData = {
      amount: parseFloat(amount) || 0,
      status,
      paidDate: status === 'paid' ? paidDate : null,
      note: note.trim()
    };

    onSavePayment(expense.id, selectedMonth, paymentData);

    if (status === 'paid') {
      triggerConfetti();
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="metallic-card-surface glass-modal w-full max-w-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Registrar Pago de Gasto
              </h2>
              <p className="text-xs text-metal-400">
                {expense.name} • {bank.name}
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
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Estado del Pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus('paid')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                    : 'bg-metal-950 text-metal-400 border-white/5 hover:text-white'
                }`}
              >
                ✓ Pagado
              </button>
              <button
                type="button"
                onClick={() => setStatus('partial')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'partial'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-metal-950 text-metal-400 border-white/5 hover:text-white'
                }`}
              >
                Parcial / Abono
              </button>
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                  status === 'pending'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                    : 'bg-metal-950 text-metal-400 border-white/5 hover:text-white'
                }`}
              >
                Pendiente
              </button>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Monto a Registrar ($) *
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-metal-950 border border-white/10 text-white text-base font-mono font-extrabold focus:outline-none focus:border-amber-400"
              />
            </div>
            <span className="text-[11px] text-metal-400 mt-1 block">
              Monto estimado base: {formatMoney(expense.estimatedAmount)}
            </span>
          </div>

          {/* Payment Date */}
          {status === 'paid' && (
            <div>
              <label className="block text-xs font-semibold text-metal-300 mb-1">
                Fecha del Pago
              </label>
              <input
                type="date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* Note / Reference */}
          <div>
            <label className="block text-xs font-semibold text-metal-300 mb-1">
              Nota / Referencia de Pago
            </label>
            <input
              type="text"
              placeholder="Ej. Transferencia Banco Pichincha, Comprobante #1234"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 placeholder-metal-600"
            />
          </div>

          {/* Action Buttons */}
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
              className="metallic-btn-gold px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Guardar Pago
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
