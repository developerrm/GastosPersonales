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
  Palette,
  Sparkles,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { THEMES } from '../services/themeService';

export const Navbar = ({
  activeTab,
  setActiveTab,
  selectedMonth,
  setSelectedMonth,
  months,
  themeSettings,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onOpenSqlModal,
  onOpenDataModal,
  onOpenBanksModal,
  onOpenThemeModal,
  onToggleMinimalist
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'matrix', label: 'Matriz Multi-Mes', icon: Table },
    { id: 'cards', label: 'Gastos & CRUD', icon: CreditCard },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'analytics', label: 'Gráficos & Análisis', icon: BarChart3 },
    { id: 'banks', label: 'Bancos & Categorías', icon: Layers }
  ];

  const currentTheme = THEMES.find((t) => t.id === themeSettings?.theme) || THEMES[0];
  const isMinimalist = !!themeSettings?.minimalistMode;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md border-b shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand / Logo */}
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTheme.badgeClass || 'from-amber-400 to-amber-700'} p-0.5 shadow-sm flex items-center justify-center`}
            >
              <div
                className="w-full h-full rounded-[10px] flex items-center justify-center"
                style={{ backgroundColor: 'var(--color-bg-card-solid)' }}
              >
                <Wallet className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight">
                  Finanz<span style={{ color: currentTheme.primaryColor }}>Titan</span>
                </span>
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border uppercase tracking-widest"
                  style={{
                    backgroundColor: 'var(--color-accent-glow)',
                    color: 'var(--color-accent)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  PRO
                </span>
              </div>
              <p className="text-[11px] opacity-75 font-medium hidden sm:block">Control de Gastos Fijos & Fechas</p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav
            className="hidden md:flex items-center gap-1 p-1 rounded-xl border shadow-inner"
            style={{
              backgroundColor: 'var(--color-table-head)',
              borderColor: 'var(--color-border)'
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--color-bg-card-solid)',
                          color: 'var(--color-text-main)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          border: '1px solid var(--color-border)'
                        }
                      : {
                          color: 'var(--color-text-muted)',
                          opacity: 0.85
                        }
                  }
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? 'var(--color-accent)' : 'inherit' }}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Buttons & Customization Controls */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Quick Minimalist / Focus Toggle */}
            <button
              onClick={onToggleMinimalist}
              title={isMinimalist ? 'Desactivar Modo Minimalista (Mostrar todo)' : 'Activar Modo Minimalista (Vista limpia / Focus)'}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium transition-all border shadow-sm"
              style={
                isMinimalist
                  ? {
                      backgroundColor: 'var(--color-accent-glow)',
                      color: 'var(--color-accent)',
                      borderColor: 'var(--color-accent)'
                    }
                  : {
                      backgroundColor: 'var(--color-bg-card-solid)',
                      borderColor: 'var(--color-border)'
                    }
              }
            >
              {isMinimalist ? (
                <Minimize2 className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
              ) : (
                <Maximize2 className="w-3.5 h-3.5" />
              )}
              <span className="text-[11px]">{isMinimalist ? 'Minimalista' : 'Detallado'}</span>
            </button>

            {/* Theme & Customization Button */}
            <button
              onClick={onOpenThemeModal}
              title="Personalizar Tema, Colores y Bordes"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all shadow-sm group"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Palette className="w-3.5 h-3.5 group-hover:rotate-12 transition-transform" style={{ color: currentTheme.primaryColor }} />
              <span>{currentTheme.name.split(' ')[0]}</span>
              <span className="w-2.5 h-2.5 rounded-full border border-black/10" style={{ backgroundColor: currentTheme.primaryColor }} />
            </button>

            {/* Quick Income Button */}
            <button
              onClick={onOpenIncomeModal}
              title="Ajustar Sueldo / Ingreso del mes"
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-medium border transition-all shadow-sm"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
              <span>Sueldo</span>
            </button>

            {/* SQL Migration Tool */}
            <button
              onClick={onOpenSqlModal}
              title="Generar Script y Schema MySQL"
              className="p-2 rounded-xl border transition-all shadow-sm"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Database className="w-3.5 h-3.5 text-sky-500" />
            </button>

            {/* Backup / Export */}
            <button
              onClick={onOpenDataModal}
              title="Copia de Seguridad & Restauración"
              className="p-2 rounded-xl border transition-all shadow-sm"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* Add Expense Primary Button */}
            <button
              onClick={onOpenExpenseModal}
              className="metallic-btn-gold flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide shadow-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>+ Gasto</span>
            </button>
          </div>

          {/* Mobile Menu Toggle & Quick Actions */}
          <div className="flex items-center gap-1.5 md:hidden">
            <button
              onClick={onOpenThemeModal}
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
              title="Personalizar Tema"
            >
              <Palette className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
            </button>
            <button
              onClick={onOpenExpenseModal}
              className="metallic-btn-gold p-2 rounded-xl"
              title="Nuevo Gasto"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b px-4 pt-2 pb-4 space-y-3"
          style={{
            backgroundColor: 'var(--color-modal-bg)',
            borderColor: 'var(--color-border)'
          }}
        >
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
                  className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all border"
                  style={
                    isActive
                      ? {
                          backgroundColor: 'var(--color-bg-card-solid)',
                          borderColor: 'var(--color-accent)',
                          color: 'var(--color-accent)'
                        }
                      : {
                          backgroundColor: 'var(--color-table-head)',
                          borderColor: 'var(--color-border)'
                        }
                  }
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? 'var(--color-accent)' : 'inherit' }} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Quick Settings & Tools */}
          <div className="grid grid-cols-4 gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => {
                onOpenThemeModal();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[11px] border"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Palette className="w-4 h-4" style={{ color: currentTheme.primaryColor }} />
              <span>Tema</span>
            </button>
            <button
              onClick={() => {
                onOpenIncomeModal();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[11px] border text-emerald-500"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <DollarSign className="w-4 h-4" />
              <span>Sueldo</span>
            </button>
            <button
              onClick={() => {
                onOpenSqlModal();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[11px] border text-sky-500"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Database className="w-4 h-4" />
              <span>MySQL</span>
            </button>
            <button
              onClick={() => {
                onOpenDataModal();
                setMobileMenuOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl text-[11px] border"
              style={{
                backgroundColor: 'var(--color-bg-card-solid)',
                borderColor: 'var(--color-border)'
              }}
            >
              <Download className="w-4 h-4" />
              <span>Backup</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
