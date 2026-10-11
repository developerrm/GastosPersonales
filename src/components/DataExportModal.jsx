import React, { useState } from 'react';
import {
  X,
  Download,
  FileSpreadsheet,
  FileJson,
  Check
} from 'lucide-react';
import { storageService } from '../services/storageService';

export const DataExportModal = ({
  isOpen,
  onClose,
  expenses,
  months
}) => {
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Export JSON
  const handleExportJSON = () => {
    const data = storageService.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finanztitan_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg('Copia de seguridad descargada.');
  };

  // Export CSV
  const handleExportCSV = () => {
    const data = storageService.exportAllData();
    let csv = 'Banco,Gasto,Fecha Corte,Fecha Max Pago,Estimado';
    months.forEach((m) => {
      csv += `,${m.label || m.key}`;
    });
    csv += '\n';

    data.expenses.forEach((e) => {
      const bank = data.banks.find((b) => b.id === e.bankId)?.name || e.bankId;
      csv += `"${bank}","${e.name}",${e.billingDay},${e.dueDay},${e.estimatedAmount}`;
      months.forEach((m) => {
        const p = e.monthlyPayments?.[m.key];
        const val = p?.amount !== undefined ? p.amount : e.estimatedAmount;
        csv += `,${val}`;
      });
      csv += '\n';
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finanztitan_gastos_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccessMsg('Archivo CSV para Excel generado.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="metallic-card-surface glass-modal w-full max-w-md p-6 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Copia de Seguridad & Exportación
              </h2>
              <p className="text-xs text-metal-400">
                Guarda tus datos en local o expórtalos a Excel/CSV.
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

        {/* Feedback Messages */}
        {successMsg && (
          <div className="p-3 mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}
        <div className="space-y-3">
          {/* Export JSON Button */}
          <button
            onClick={handleExportJSON}
            className="w-full p-3 rounded-xl bg-metal-950/80 border border-white/10 hover:border-amber-500/40 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-metal-900 text-amber-400">
                <FileJson className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block group-hover:text-amber-300">
                  Exportar Backup Completo (JSON)
                </span>
                <span className="text-[11px] text-metal-400">
                  Incluye gastos, historial de pagos, sueldos y bancos.
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-metal-400 group-hover:text-amber-400" />
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="w-full p-3 rounded-xl bg-metal-950/80 border border-white/10 hover:border-emerald-500/40 text-left flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-metal-900 text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-xs block group-hover:text-emerald-300">
                  Exportar a Excel / Planilla (CSV)
                </span>
                <span className="text-[11px] text-metal-400">
                  Formato tabular con proyecciones mensuales.
                </span>
              </div>
            </div>
            <Download className="w-4 h-4 text-metal-400 group-hover:text-emerald-400" />
          </button>

          <p className="text-[11px] text-metal-400">
            La restauración de copias no está disponible con los endpoints actuales del backend.
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
          <button
            onClick={onClose}
            className="metallic-btn-silver px-5 py-2 rounded-xl text-xs font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
