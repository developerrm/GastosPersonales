import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  DollarSign,
  Database,
  Download,
  Settings,
  Menu,
  X,
  Layers,
  Calendar,
  BarChart3,
  Table,
  CreditCard,
  Sparkles
} from 'lucide-react';
import { getMonthName } from '../utils/formatters';

export const Navbar = ({
  activeTab,
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
  months,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onOpenSqlModal,
  onOpenDataModal,
  onOpenBanksModal
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'matrix', label: 'Matriz Multi-Mes', icon: Table },
    { id: 'cards', label: 'Gastos & CRUD', icon: CreditCard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'analytics', label: 'Gráficos & Análisis', icon: BarChart3 },
    { id: 'banks', label: 'Bancos & Categorías', icon: Layers }
  ];

  return (
    <header className="sticky top-0 z-40 bg-metal-950/80 backdrop-blur-md border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 p-0.5 shadow-metallic-glow-gold flex items-center justify-center">
              <div className="w-full h-full bg-metal-900 rounded-[10px] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Finanz<span className="text-metallic-gold">Titan</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 uppercase tracking-widest">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-metal-400 font-medium">Control de Gastos Fijos & Fechas</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-metal-900/90 p-1 rounded-xl border border-white/5 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'metallic-btn-silver text-white shadow-lg'
                      : 'text-metal-400 hover:text-metal-200 hover:bg-metal-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-metal-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Quick Income Button */}
            <button
              onClick={onOpenIncomeModal}
              title="Ajustar Sueldo / Ingreso del mes"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-metal-300 bg-metal-900 border border-white/10 hover:border-amber-500/40 hover:text-amber-300 transition-all shadow-sm"
            >
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Sueldo</span>
            </button>

            {/* SQL Migration Tool */}
            <button
              onClick={onOpenSqlModal}
              title="Generar Script y Schema MySQL"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-metal-300 bg-metal-900 border border-white/10 hover:border-sky-500/40 hover:text-sky-300 transition-all shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span>MySQL</span>
            </button>

            {/* Backup / Export */}
            <button
              onClick={onOpenDataModal}
              title="Copia de Seguridad & Restauración"
              className="p-2 rounded-xl text-metal-400 bg-metal-900 border border-white/10 hover:text-white hover:border-white/20 transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Add Expense Primary Button */}
            <button
              onClick={onOpenExpenseModal}
              className="metallic-btn-gold flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Nuevo Gasto</span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onOpenExpenseModal}
              className="metallic-btn-gold p-2 rounded-xl"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-metal-300 bg-metal-900 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-metal-950/95 backdrop-blur-xl px-4 pt-2 pb-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'metallic-btn-silver text-white'
                      : 'text-metal-400 bg-metal-900/60 border border-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-metal-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10">
            <button
              onClick={() => {
                onOpenIncomeModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs bg-metal-900 border border-white/10 text-amber-300"
            >
              <DollarSign className="w-3.5 h-3.5" />
              Sueldo
            </button>
            <button
              onClick={() => {
                onOpenSqlModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs bg-metal-900 border border-white/10 text-sky-300"
            >
              <Database className="w-3.5 h-3.5" />
              MySQL
            </button>
            <button
              onClick={() => {
                onOpenDataModal();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs bg-metal-900 border border-white/10 text-metal-300"
            >
              <Download className="w-3.5 h-3.5" />
              Backup
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
