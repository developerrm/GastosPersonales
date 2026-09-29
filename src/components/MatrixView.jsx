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
  TrendingDown,
  Sparkles,
  Calendar,
  Check,
  Eye,
  Layers,
  ChevronRight
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';
import { getAccessibleBadgeStyle, getModifiedAmountStyle, getTableFooterStyle } from '../utils/colorEngine';

export const MatrixView = ({
  expenses,
  incomes,
  months,
  banks,
  categories,
  selectedMonth = '2026-09',
  themeSettings,
  onUpdatePayment,
  onOpenExpenseModal,
  onEditExpense,
  onDeleteExpense,
  onOpenIncomeModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBankFilter, setSelectedBankFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [monthRangeFilter, setMonthRangeFilter] = useState('all'); // 'all' | 'quarter' | 'semester'
  const [editingCell, setEditingCell] = useState(null); // { expId, monthKey, value }
  const [hoveredRowId, setHoveredRowId] = useState(null);
  const [hoveredColKey, setHoveredColKey] = useState(null);

  const highlightActive = themeSettings?.highlightActiveMonth !== false;
  const zebraStripes = themeSettings?.zebraStripes !== false;
  const crosshairHover = themeSettings?.crosshairHover !== false;
  const showProgressMini = themeSettings?.showProgressMini !== false;

  const isLightMode = ['rose', 'cupcake', 'light'].includes(themeSettings?.theme);
  const footerStyle = getTableFooterStyle(isLightMode);
  const modifiedStyle = getModifiedAmountStyle(isLightMode);

  // Compute visible months according to monthRangeFilter
  const currentMonthIdx = months.findIndex((m) => m.key === selectedMonth);
  let visibleMonths = months;

  if (monthRangeFilter === 'quarter') {
    // Show selected month ± 1 month (or 3 months window)
    const start = Math.max(0, Math.min(currentMonthIdx - 1, months.length - 3));
    visibleMonths = months.slice(start, start + 3);
  } else if (monthRangeFilter === 'semester') {
    const start = Math.max(0, Math.min(currentMonthIdx - 2, months.length - 6));
    visibleMonths = months.slice(start, start + 6);
  }

  // Filtered expenses
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.notes && exp.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBank = selectedBankFilter === 'all' || exp.bankId === selectedBankFilter;
    const matchesCat = selectedCategoryFilter === 'all' || exp.categoryId === selectedCategoryFilter;

    // Status filter across visible months
    let matchesStatus = true;
    if (statusFilter === 'pending') {
      // Must have at least 1 unpaid month in visible months
      const hasPending = visibleMonths.some((m) => exp.monthlyPayments?.[m.key]?.status !== 'paid');
      matchesStatus = hasPending;
    } else if (statusFilter === 'completed') {
      // All visible months are paid
      const allPaid = visibleMonths.every((m) => exp.monthlyPayments?.[m.key]?.status === 'paid');
      matchesStatus = allPaid;
    }

    return matchesSearch && matchesBank && matchesCat && matchesStatus;
  });

  // Calculate Column Totals for visible months
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
    <div className="space-y-3">
      {/* Top Filter & Toolbar */}
      <div className="metallic-card-surface rounded-2xl p-4 border border-white/10 shadow-metallic space-y-3">
        {/* Row 1: Search, Dropdowns, Add button */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-metal-400" />
            <input
              type="text"
              placeholder="Buscar por gasto, banco o nota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-metal-950/80 border border-white/10 text-white placeholder-metal-500 text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Bank & Category Dropdowns */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <select
              value={selectedBankFilter}
              onChange={(e) => setSelectedBankFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-metal-300 text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="all">🏦 Todos los Bancos ({banks.length})</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-metal-950 border border-white/10 text-metal-300 text-xs focus:outline-none focus:border-amber-400"
            >
              <option value="all">🏷️ Todas las Categorías</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Add Expense Shortcut */}
            <button
              onClick={onOpenExpenseModal}
              className="metallic-btn-gold px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Gasto</span>
            </button>
          </div>
        </div>

        {/* Row 2: Horizon Filters & Status Pills for Maximum Visual Comfort */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-xs">
          {/* Horizon Column Selector (3m, 6m, 12m) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-metal-400 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Horizonte de Meses:</span>
            </span>
            <div className="flex items-center gap-1 bg-metal-950 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setMonthRangeFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  monthRangeFilter === 'all'
                    ? 'metallic-btn-gold text-white shadow-sm'
                    : 'text-metal-400 hover:text-white'
                }`}
              >
                Todos ({months.length}m)
              </button>
              <button
                onClick={() => setMonthRangeFilter('quarter')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  monthRangeFilter === 'quarter'
                    ? 'metallic-btn-gold text-white shadow-sm'
                    : 'text-metal-400 hover:text-white'
                }`}
                title="Mostrar solo trimestre centrado en el mes activo"
              >
                Trimestre (3m)
              </button>
              <button
                onClick={() => setMonthRangeFilter('semester')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  monthRangeFilter === 'semester'
                    ? 'metallic-btn-gold text-white shadow-sm'
                    : 'text-metal-400 hover:text-white'
                }`}
              >
                Semestre (6m)
              </button>
            </div>
          </div>

          {/* Status Filter (Solo con pendientes vs todos) */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-bold text-metal-400 mr-1">Filtro Estado:</span>
            <div className="flex items-center gap-1 bg-metal-950 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  statusFilter === 'all' ? 'bg-metal-800 text-white' : 'text-metal-400 hover:text-white'
                }`}
              >
                Todos ({expenses.length})
              </button>
              <button
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  statusFilter === 'pending'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-metal-400 hover:text-white'
                }`}
              >
                Con Pendientes
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  statusFilter === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-metal-400 hover:text-white'
                }`}
              >
                100% Pagados
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Spreadsheet Matrix */}
      <div className="metallic-card-surface rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className={`w-full text-left matrix-table text-xs border-collapse ${zebraStripes ? 'matrix-table-zebra' : ''}`}>
            <thead>
              <tr className="border-b border-white/15">
                {/* 1. Banco (Sticky Column) */}
                <th className="py-3 px-4 text-metal-300 font-extrabold uppercase tracking-wider sticky left-0 z-20 sticky-column-banco min-w-[130px]">
                  BANCO
                </th>

                {/* 2. Gasto (Sticky Column) */}
                <th className="py-3 px-4 text-metal-300 font-extrabold uppercase tracking-wider sticky left-[130px] z-20 sticky-column-gasto min-w-[180px]">
                  GASTOS MENSUALES
                </th>

                {/* 3. Fechas */}
                <th className="py-3 px-3 text-metal-400 font-bold uppercase tracking-wider min-w-[110px] text-center">
                  CORTE
                </th>
                <th className="py-3 px-3 text-metal-400 font-bold uppercase tracking-wider min-w-[110px] text-center">
                  MÁX PAGO
                </th>
                <th className="py-3 px-4 text-amber-300 font-extrabold uppercase tracking-wider min-w-[110px] text-right bg-amber-500/5">
                  ESTIMADO
                </th>

                {/* 4. Visible Month Columns */}
                {visibleMonths.map((m) => {
                  const isSelected = m.key === selectedMonth;
                  const isColHovered = crosshairHover && hoveredColKey === m.key;

                  return (
                    <th
                      key={m.key}
                      onMouseEnter={() => setHoveredColKey(m.key)}
                      onMouseLeave={() => setHoveredColKey(null)}
                      className={`py-3 px-3 text-center min-w-[130px] font-extrabold border-l transition-all ${
                        isSelected && highlightActive
                          ? 'col-active-month-header'
                          : isColHovered
                          ? 'opacity-100'
                          : 'opacity-90'
                      }`}
                      style={{
                        borderColor: 'var(--color-border)',
                        color: isSelected && highlightActive ? 'var(--color-accent)' : 'inherit'
                      }}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-extrabold text-sm tracking-tight">{m.shortLabel || m.label}</span>
                        {isSelected && highlightActive && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold tracking-tight shadow-sm"
                            style={{
                              backgroundColor: 'var(--color-accent)',
                              color: '#ffffff'
                            }}
                            title="Mes Seleccionado"
                          >
                            ACTIVO
                          </span>
                        )}
                      </div>
                      <div
                        className="text-[10px] font-mono font-normal mt-0.5"
                        style={{ color: 'var(--color-accent)' }}
                      >
                        Sueldo: {formatMoney(monthIncomes[m.key] || 0)}
                      </div>
                    </th>
                  );
                })}

                <th className="py-3 px-3 text-center min-w-[80px] font-bold text-metal-400">
                  ACCIONES
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5 font-mono">
              {filteredExpenses.map((exp) => {
                const bank = banks.find((b) => b.id === exp.bankId) || {
                  name: 'Banco',
                  shortName: 'Banco',
                  badgeClass: 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                };

                // Calculate paid count across all months
                const totalMonthsCount = months.length;
                let paidMonthsCount = 0;
                months.forEach((m) => {
                  if (exp.monthlyPayments?.[m.key]?.status === 'paid') paidMonthsCount++;
                });

                const isRowHovered = crosshairHover && hoveredRowId === exp.id;
                const isHighlight = exp.name.toUpperCase().includes('INTERNET') || exp.name.toUpperCase().includes('TARJETA');

                return (
                  <tr
                    key={exp.id}
                    onMouseEnter={() => setHoveredRowId(exp.id)}
                    onMouseLeave={() => setHoveredRowId(null)}
                    className={`transition-colors ${
                      isRowHovered
                        ? 'bg-metal-800/50'
                        : isHighlight
                        ? 'bg-amber-500/5 hover:bg-amber-500/10'
                        : 'hover:bg-metal-800/30'
                    }`}
                  >
                    {/* 1. Banco (Sticky) */}
                    <td className="py-2.5 px-4 sticky left-0 z-10 sticky-column-banco font-sans">
                      <span
                        className="inline-block px-2.5 py-1 rounded-md text-[11px] font-bold border"
                        style={getAccessibleBadgeStyle(bank.color || '#64748b', isLightMode)}
                      >
                        {bank.shortName || bank.name}
                      </span>
                    </td>

                    {/* 2. Nombre del Gasto (Sticky) */}
                    <td className="py-2.5 px-4 font-sans sticky left-[130px] z-10 sticky-column-gasto">
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-white text-xs truncate max-w-[140px]">{exp.name}</div>
                        {/* Mini Annual Progress Pill */}
                        {showProgressMini && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border whitespace-nowrap ${
                              paidMonthsCount === totalMonthsCount
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 font-bold'
                                : paidMonthsCount > 0
                                ? 'bg-sky-500/10 text-sky-300 border-sky-500/20'
                                : 'bg-metal-800 text-metal-400 border-white/5'
                            }`}
                            title={`${paidMonthsCount} de ${totalMonthsCount} meses pagados en el año`}
                          >
                            {paidMonthsCount}/{totalMonthsCount} pagados
                          </span>
                        )}
                      </div>
                      {exp.notes && (
                        <div className="text-[10px] text-metal-400 truncate max-w-[160px]">
                          {exp.notes}
                        </div>
                      )}
                    </td>

                    {/* 3. Fecha Emisión / Corte */}
                    <td className="py-2.5 px-3 text-center text-metal-300 font-sans text-xs">
                      Día {exp.billingDay}
                    </td>

                    {/* 4. Fecha Máxima de Pago */}
                    <td className="py-2.5 px-3 text-center font-sans text-xs">
                      <span
                        className="inline-block px-2 py-0.5 rounded-full font-bold border"
                        style={{
                          backgroundColor: 'var(--color-accent-glow)',
                          color: 'var(--color-accent)',
                          borderColor: 'var(--color-border)'
                        }}
                      >
                        Día {exp.dueDay}
                      </span>
                    </td>

                    {/* 5. Estimado ($) */}
                    <td
                      className="py-2.5 px-4 text-right font-extrabold"
                      style={{ backgroundColor: 'var(--color-active-col)', color: 'var(--color-text-main)' }}
                    >
                      {formatMoney(exp.estimatedAmount)}
                    </td>

                    {/* 6. Dynamic Month Columns */}
                    {visibleMonths.map((m) => {
                      const mKey = m.key;
                      const payment = exp.monthlyPayments?.[mKey];
                      const amount = payment?.amount !== undefined ? payment.amount : exp.estimatedAmount;
                      const isPaid = payment?.status === 'paid';
                      const isSelectedMonth = mKey === selectedMonth;
                      const isEditing =
                        editingCell && editingCell.expId === exp.id && editingCell.monthKey === mKey;
                      const isColHovered = crosshairHover && hoveredColKey === mKey;
                      const isModified = payment?.amount !== undefined && Number(payment.amount) !== Number(exp.estimatedAmount);

                      return (
                        <td
                          key={mKey}
                          onMouseEnter={() => setHoveredColKey(mKey)}
                          onMouseLeave={() => setHoveredColKey(null)}
                          className={`py-2 px-2 text-center border-l border-white/5 relative group transition-all ${
                            isSelectedMonth && highlightActive
                              ? 'col-active-month-cell'
                              : isColHovered
                              ? 'bg-metal-800/30'
                              : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            {/* Toggle Paid Button */}
                            <button
                              onClick={() => togglePaymentStatus(exp, mKey)}
                              title={isPaid ? 'Marcado como pagado (clic para desmarcar)' : 'Pendiente (clic para marcar pagado)'}
                              className={`p-1 rounded-md transition-all ${
                                isPaid
                                  ? 'text-emerald-400 hover:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30'
                                  : 'text-metal-600 hover:text-amber-400 hover:bg-metal-800 border border-transparent'
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
                                title={isModified ? `Monto modificado de base ($${exp.estimatedAmount}) - Clic para editar` : 'Clic para editar monto'}
                                className={`w-full text-right font-bold transition-all px-1.5 py-0.5 rounded flex items-center justify-end gap-1 ${
                                  isPaid
                                    ? 'text-emerald-300 bg-emerald-950/20 hover:bg-emerald-900/30'
                                    : amount === 0
                                    ? 'text-metal-500 hover:bg-metal-800'
                                    : !isModified
                                    ? 'text-white hover:bg-metal-800 hover:text-amber-300'
                                    : ''
                                }`}
                                style={isModified && !isPaid && amount !== 0 ? {
                                  backgroundColor: modifiedStyle.backgroundColor,
                                  color: modifiedStyle.color,
                                  border: `1px solid ${modifiedStyle.borderColor}`
                                } : {}}
                              >
                                {amount === 0 ? (
                                  <span className="text-metal-500">-</span>
                                ) : (
                                  <>
                                    {formatMoney(amount)}
                                    {isModified && (
                                      <span
                                        className="w-1.5 h-1.5 rounded-full"
                                        style={{ backgroundColor: modifiedStyle.indicatorColor }}
                                        title="Monto ajustado manualmente"
                                      />
                                    )}
                                  </>
                                )}
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

              {/* 1. TOTAL GASTOS MENSUALES ROW */}
              <tr
                className="font-extrabold shadow-lg"
                style={{
                  background: footerStyle.background,
                  borderTop: `2px solid ${footerStyle.borderColor}`,
                  color: footerStyle.textLabelColor
                }}
              >
                <td
                  colSpan={4}
                  className="py-3 px-4 font-sans uppercase tracking-wider text-right font-extrabold sticky left-0 z-10"
                  style={{
                    background: footerStyle.background
                  }}
                >
                  TOTAL GASTOS MENSUALES:
                </td>
                <td
                  className="py-3 px-4 text-right font-mono text-sm"
                  style={{ color: footerStyle.estimatedColor }}
                >
                  {formatMoney(totalEstimatedSum)}
                </td>
                {visibleMonths.map((m) => (
                  <td
                    key={m.key}
                    className={`py-3 px-3 text-right font-mono text-sm border-l ${
                      m.key === selectedMonth && highlightActive ? 'font-extrabold shadow-inner' : ''
                    }`}
                    style={{
                      borderColor: footerStyle.borderColor,
                      color: footerStyle.numberColor,
                      backgroundColor: m.key === selectedMonth && highlightActive ? 'rgba(0,0,0,0.15)' : 'transparent'
                    }}
                  >
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
                {visibleMonths.map((m) => (
                  <td key={m.key} className="py-2.5 px-3 text-right font-mono text-xs text-amber-400 font-bold border-l border-white/5">
                    {formatMoney(monthIncomes[m.key] || 0)}
                  </td>
                ))}
                <td className="py-2.5 px-3 text-center">
                  <button
                    onClick={onOpenIncomeModal}
                    className="text-[10px] text-amber-400 hover:underline font-bold"
                  >
                    Editar
                  </button>
                </td>
              </tr>

              {/* 3. SALDOS REMANENTES ROW */}
              <tr className="bg-metal-950 font-extrabold text-white border-t-2 border-emerald-500/40">
                <td colSpan={4} className="py-3 px-4 font-sans uppercase tracking-wider text-right font-extrabold text-sm sticky left-0 z-10 bg-metal-950 text-emerald-400">
                  Saldos Restantes:
                </td>
                <td className="py-3 px-4 text-right font-mono text-xs text-metal-500">
                  -
                </td>
                {visibleMonths.map((m) => {
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
      <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-metal-400 px-2 gap-2">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Tip: Clic en cualquier celda para editar el monto. Clic en el círculo verde/gris para marcar como pagado.</span>
        </div>
        <span className="font-mono text-metal-400">
          Mostrando {filteredExpenses.length} de {expenses.length} gastos ({visibleMonths.length} meses visibles)
        </span>
      </div>
    </div>
  );
};
