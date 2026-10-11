import React, { useState } from 'react';
import {
  Building2,
  Plus,
  Tag,
} from 'lucide-react';
import { formatMoney } from '../utils/formatters';

export const BanksManager = ({
  banks,
  categories,
  expenses,
  onSaveBank,
  onSaveCategory
}) => {
  const [editingBank, setEditingBank] = useState(null);
  const [bankFormData, setBankFormData] = useState({
    id: '',
    name: '',
    color: '#f59e0b',
    accountType: 'Cuenta de Ahorros',
    accountNumber: ''
  });

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [catFormData, setCatFormData] = useState({
    id: '',
    name: '',
    icon: 'Tag',
    color: '#38bdf8'
  });

  // Handle bank save
  const handleBankSubmit = (e) => {
    e.preventDefault();
    if (!bankFormData.name) return;

    const id = bankFormData.id || `bank-${Date.now()}`;
    const newBank = {
      ...bankFormData,
      id,
      badgeClass: `bg-[${bankFormData.color}]/15 text-white border-white/20`
    };

    onSaveBank(newBank);
    setEditingBank(null);
    setBankFormData({
      id: '',
      name: '',
      color: '#f59e0b',
      accountType: 'Cuenta de Ahorros',
      accountNumber: ''
    });
  };

  const handleCategorySubmit = (e) => {
    e.preventDefault();
    if (!catFormData.name.trim()) return;
    onSaveCategory({ ...catFormData, name: catFormData.name.trim() });
    setIsAddingCategory(false);
    setCatFormData({ id: '', name: '', icon: 'Tag', color: '#38bdf8' });
  };

  return (
    <div className="space-y-6">
      {/* 1. SECCIÓN DE BANCOS */}
      <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Bancos e Instituciones Financieras
              </h2>
              <p className="text-xs text-metal-400">
                Configura tus cuentas bancarias y métodos de pago asociados a tus gastos.
              </p>
            </div>
          </div>

          {!editingBank && (
            <button
              onClick={() => {
                setEditingBank('new');
                setBankFormData({
                  id: '',
                  name: '',
                  color: '#f59e0b',
                  accountType: 'Cuenta de Ahorros',
                  accountNumber: ''
                });
              }}
              className="metallic-btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Banco</span>
            </button>
          )}
        </div>

        {/* Bank Edit / Add Form */}
        {editingBank && (
          <form onSubmit={handleBankSubmit} className="bg-metal-950 p-4 rounded-xl border border-amber-500/30 mb-6 space-y-4">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Agregar Nuevo Banco</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs text-metal-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Banco Pichincha"
                  value={bankFormData.name}
                  onChange={(e) => setBankFormData({ ...bankFormData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-white/10 text-white text-xs focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-metal-300 mb-1">Tipo de Cuenta</label>
                <select
                  value={bankFormData.accountType}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-white/10 text-white text-xs focus:border-amber-400"
                >
                  <option value="Cuenta de Ahorros">Cuenta de Ahorros</option>
                  <option value="Cuenta Corriente">Cuenta Corriente</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Efectivo / Billetera">Efectivo / Billetera</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-metal-300 mb-1">Número de Cuenta</label>
                <input
                  type="text"
                  placeholder="Opcional"
                  value={bankFormData.accountNumber}
                  onChange={(e) => setBankFormData({ ...bankFormData, accountNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-white/10 text-white text-xs focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs text-metal-300 mb-1">Color Distintivo</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bankFormData.color}
                    onChange={(e) => setBankFormData({ ...bankFormData, color: e.target.value })}
                    className="w-10 h-8 rounded-lg bg-metal-900 border border-white/10 cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-metal-400">{bankFormData.color}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingBank(null)}
                className="px-3 py-1.5 rounded-xl text-xs text-metal-300 hover:bg-metal-800 border border-white/10"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="metallic-btn-gold px-4 py-1.5 rounded-xl text-xs font-bold"
              >
                Guardar Banco
              </button>
            </div>
          </form>
        )}

        {/* Banks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {banks.map((bank) => {
            const attachedExpenses = expenses.filter((e) => e.bankId === bank.id);
            const totalBankEstimated = attachedExpenses.reduce((sum, e) => sum + Number(e.estimatedAmount || 0), 0);

            return (
              <div
                key={bank.id}
                className="bg-metal-950/70 p-4 rounded-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3.5 h-3.5 rounded-full shadow-sm"
                        style={{ backgroundColor: bank.color }}
                      />
                      <span className="font-extrabold text-sm text-white">{bank.name}</span>
                    </div>

                  </div>

                  <p className="text-xs text-metal-400 mb-3">{bank.accountType}</p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-metal-400">{attachedExpenses.length} gastos vinculados</span>
                  <span className="font-mono font-bold text-white">{formatMoney(totalBankEstimated)}/mes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SECCIÓN DE CATEGORÍAS */}
      <div className="metallic-card-surface rounded-2xl p-5 border border-white/10 shadow-2xl">
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
          <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Categorías de Gastos</h2>
            <p className="text-xs text-metal-400">
              Categorías para clasificar tus gastos fijos (Servicios, Tarjetas, Ahorro, Inversiones, Familia, etc.).
            </p>
          </div>
          {!isAddingCategory && (
            <button
              onClick={() => setIsAddingCategory(true)}
              className="metallic-btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 ml-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              Nueva categoría
            </button>
          )}
        </div>

        {isAddingCategory && (
          <form onSubmit={handleCategorySubmit} className="bg-metal-950 p-4 rounded-xl border border-sky-500/30 mb-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs text-metal-300 mb-1">Nombre</label>
              <input
                type="text"
                required
                maxLength="100"
                value={catFormData.name}
                onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-white/10 text-white text-xs focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs text-metal-300 mb-1">Icono</label>
              <input
                type="text"
                maxLength="50"
                value={catFormData.icon}
                onChange={(e) => setCatFormData({ ...catFormData, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-metal-900 border border-white/10 text-white text-xs focus:border-sky-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={catFormData.color}
                onChange={(e) => setCatFormData({ ...catFormData, color: e.target.value })}
                className="w-10 h-8 rounded-lg bg-metal-900 border border-white/10 cursor-pointer p-0.5"
              />
              <button type="submit" className="metallic-btn-gold px-3 py-2 rounded-xl text-xs font-bold">Guardar</button>
              <button type="button" onClick={() => setIsAddingCategory(false)} className="text-xs text-metal-400 hover:text-white">Cancelar</button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map((cat) => {
            const count = expenses.filter((e) => e.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                className="bg-metal-950/70 p-3 rounded-xl border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-bold text-xs text-white">{cat.name}</span>
                </div>
                <span className="text-[11px] text-metal-400 font-mono">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
