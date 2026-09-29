import React, { useState } from 'react';
import {
  Wallet,
  PlusCircle,
  DollarSign,
  Database,
  Download,
  Settings,
  Layers,
  Calendar,
  BarChart3,
  Table,
  CreditCard,
  Palette,
  Sparkles,
  Minimize2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { THEMES } from '../services/themeService';

export const Sidebar = ({
  activeTab,
  setActiveTab,
  themeSettings,
  onOpenExpenseModal,
  onOpenIncomeModal,
  onOpenSqlModal,
  onOpenDataModal,
  onOpenThemeModal,
  onToggleMinimalist,
  isSidebarCollapsed,
  onToggleSidebar
}) => {
  const tabs = [
    { id: 'matrix', label: 'Matriz Multi-Mes', icon: Table, desc: 'Vista consolidada' },
    { id: 'cards', label: 'Gastos & CRUD', icon: CreditCard, desc: 'Gestión detallada' },
    { id: 'calendar', label: 'Calendario', icon: Calendar, desc: 'Vencimientos' },
    { id: 'analytics', label: 'Gráficos & Análisis', icon: BarChart3, desc: 'Reportes y métricas' },
    { id: 'banks', label: 'Bancos & Categorías', icon: Layers, desc: 'Instituciones' }
  ];

  const currentTheme = THEMES.find((t) => t.id === themeSettings?.theme) || THEMES[0];
  const isMinimalist = !!themeSettings?.minimalistMode;

  return (
    <aside
      className={`hidden md:flex flex-col fixed top-0 left-0 bottom-0 z-40 transition-all duration-300 border-r shadow-lg select-none ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        backgroundColor: 'var(--color-modal-bg)',
        borderColor: 'var(--color-border)',
        backdropFilter: 'blur(16px)'
      }}
    >
      {/* 1. Brand / Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${currentTheme.badgeClass || 'from-amber-400 to-amber-700'} p-0.5 shadow-sm shrink-0 flex items-center justify-center`}
          >
            <div
              className="w-full h-full rounded-[10px] flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-bg-card-solid)' }}
            >
              <Wallet className="w-5 h-5" style={{ color: currentTheme.primaryColor }} />
            </div>
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight">
                  Finanz<span style={{ color: currentTheme.primaryColor }}>Titan</span>
                </span>
                <span
                  className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border uppercase tracking-widest font-bold"
                  style={{
                    backgroundColor: 'var(--color-accent-glow)',
                    color: 'var(--color-accent)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  PRO
                </span>
              </div>
              <p className="text-[10px] opacity-70 truncate">Gestor Financiero</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg border opacity-70 hover:opacity-100 transition-all ml-auto shrink-0"
          style={{
            backgroundColor: 'var(--color-bg-card-solid)',
            borderColor: 'var(--color-border)'
          }}
          title={isSidebarCollapsed ? 'Expandir barra lateral' : 'Contraer barra lateral'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 2. Primary CTA Button (+ Nuevo Gasto) */}
      <div className="p-3">
        <button
          onClick={onOpenExpenseModal}
          className="metallic-btn-gold w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold tracking-wide shadow-md transition-transform active:scale-98"
          title="Crear nuevo gasto fijo"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>+ Nuevo Gasto</span>}
        </button>
      </div>

      {/* 3. Navigation Links */}
      <div className="flex-1 px-3 py-2 space-y-1 overflow-y-auto scrollbar-none">
        {!isSidebarCollapsed && (
          <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60">
            Navegación
          </div>
        )}

        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isSidebarCollapsed ? 'justify-center' : 'justify-start'
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: 'var(--color-active-col)',
                      color: 'var(--color-accent)',
                      border: '1px solid var(--color-accent-glow)',
                      boxShadow: '0 2px 8px var(--color-accent-glow)'
                    }
                  : {
                      color: 'var(--color-text-muted)',
                      border: '1px solid transparent'
                    }
              }
              title={isSidebarCollapsed ? tab.label : undefined}
            >
              <Icon
                className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110"
                style={{ color: isActive ? 'var(--color-accent)' : 'inherit' }}
              />
              {!isSidebarCollapsed && (
                <div className="text-left truncate">
                  <div className="font-bold text-xs" style={{ color: isActive ? 'var(--color-accent)' : 'var(--color-text-main)' }}>
                    {tab.label}
                  </div>
                  <div className="text-[10px] opacity-65 truncate font-normal">
                    {tab.desc}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Controls & Utilities (Themes, Minimalist, Income, MySQL, Export) */}
      <div className="p-3 border-t space-y-1.5" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-table-head)' }}>
        {!isSidebarCollapsed && (
          <div className="px-1 text-[10px] font-bold uppercase tracking-wider opacity-60">
            Herramientas & Estilo
          </div>
        )}

        {/* Theme Customizer Trigger */}
        <button
          onClick={onOpenThemeModal}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isSidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}
          style={{
            backgroundColor: 'var(--color-bg-card-solid)',
            borderColor: 'var(--color-border)'
          }}
          title={`Tema activo: ${currentTheme.name}`}
        >
          <div className="flex items-center gap-2 truncate">
            <Palette className="w-4 h-4 shrink-0" style={{ color: currentTheme.primaryColor }} />
            {!isSidebarCollapsed && <span className="truncate">{currentTheme.name.split(' ')[0]}</span>}
          </div>
          <span
            className="w-3 h-3 rounded-full border border-black/15 shrink-0 shadow-sm"
            style={{ backgroundColor: currentTheme.primaryColor }}
          />
        </button>

        {/* Minimalist Toggle */}
        <button
          onClick={onToggleMinimalist}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isSidebarCollapsed ? 'justify-center' : 'justify-start'
          }`}
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
          title={isMinimalist ? 'Desactivar Modo Minimalista' : 'Activar Modo Minimalista'}
        >
          {isMinimalist ? (
            <Minimize2 className="w-4 h-4 shrink-0" style={{ color: 'var(--color-accent)' }} />
          ) : (
            <Maximize2 className="w-4 h-4 shrink-0" />
          )}
          {!isSidebarCollapsed && (
            <span>{isMinimalist ? 'Modo Minimalista: ON' : 'Vista Completa: ON'}</span>
          )}
        </button>

        {/* Adjust Income */}
        <button
          onClick={onOpenIncomeModal}
          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
            isSidebarCollapsed ? 'justify-center' : 'justify-start'
          }`}
          style={{
            backgroundColor: 'var(--color-bg-card-solid)',
            borderColor: 'var(--color-border)'
          }}
          title="Ajustar Sueldo / Ingresos del mes"
        >
          <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
          {!isSidebarCollapsed && <span>Ajustar Sueldo</span>}
        </button>

        {/* Additional Utility Icons in Row */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          <button
            onClick={onOpenSqlModal}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold border text-sky-500 hover:brightness-110 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-card-solid)',
              borderColor: 'var(--color-border)'
            }}
            title="Generar Script y Schema MySQL"
          >
            <Database className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="text-[11px]">MySQL</span>}
          </button>

          <button
            onClick={onOpenDataModal}
            className="flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-semibold border hover:brightness-110 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-card-solid)',
              borderColor: 'var(--color-border)'
            }}
            title="Copia de Seguridad & Restauración"
          >
            <Download className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed && <span className="text-[11px]">Backup</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
