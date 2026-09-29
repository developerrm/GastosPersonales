import React, { useState } from 'react';
import {
  Palette,
  Sliders,
  Check,
  X,
  RotateCcw,
  Sparkles,
  Layout,
  Table,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Square,
  Maximize2,
  Minimize2,
  Grid
} from 'lucide-react';
import {
  THEMES,
  BORDER_RADIUS_OPTIONS,
  DENSITY_OPTIONS,
  CARD_STYLES,
  DEFAULT_THEME_SETTINGS
} from '../services/themeService';

export const ThemeCustomizerModal = ({
  isOpen,
  onClose,
  themeSettings,
  onSaveThemeSettings
}) => {
  const [activeTab, setActiveTab] = useState('themes');
  const [localSettings, setLocalSettings] = useState(themeSettings || DEFAULT_THEME_SETTINGS);

  if (!isOpen) return null;

  const handleUpdate = (partial) => {
    const updated = { ...localSettings, ...partial };
    setLocalSettings(updated);
    onSaveThemeSettings(updated); // live preview as they click!
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_THEME_SETTINGS);
    onSaveThemeSettings(DEFAULT_THEME_SETTINGS);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="glass-modal rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] shadow-2xl border">
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl border"
              style={{
                backgroundColor: 'var(--color-accent-glow)',
                color: 'var(--color-accent)',
                borderColor: 'var(--color-border-hover)'
              }}
            >
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Panel de Personalización & Apariencia
                <span
                  className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border"
                  style={{
                    backgroundColor: 'var(--color-accent-glow)',
                    color: 'var(--color-accent)',
                    borderColor: 'var(--color-border)'
                  }}
                >
                  En Vivo
                </span>
              </h2>
              <p className="text-xs opacity-75">
                Ajusta temas, colores, densidad de información y jerarquía visual con criterios profesionales de diseño.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl opacity-70 hover:opacity-100 hover:bg-black/5 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b flex items-center gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'themes', label: '1. Temas & Paletas', icon: Palette },
            { id: 'layout', label: '2. Bordes & Densidad', icon: Layout },
            { id: 'table', label: '3. Jerarquía de Tabla', icon: Table },
            { id: 'visibility', label: '4. Modo Minimalista', icon: Eye }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-xl text-xs font-bold border-b-2 transition-all`}
                style={
                  isActive
                    ? {
                        borderColor: 'var(--color-accent)',
                        color: 'var(--color-accent)',
                        backgroundColor: 'var(--color-active-col)'
                      }
                    : {
                        borderColor: 'transparent',
                        opacity: 0.7
                      }
                }
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* TAB 1: THEMES & PRESETS */}
          {activeTab === 'themes' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold mb-1">Paletas de Colores & Estilo Integral</h3>
                <p className="opacity-75 text-xs">
                  Cada paleta aplica una jerarquía armónica a fondos, tarjetas, tablas, textos y controles según patrones de diseño gráfico.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map((theme) => {
                  const isSelected = localSettings.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleUpdate({ theme: theme.id })}
                      className="text-left p-3.5 rounded-xl border transition-all relative group flex flex-col justify-between"
                      style={
                        isSelected
                          ? {
                              borderColor: 'var(--color-accent)',
                              backgroundColor: 'var(--color-active-col)',
                              boxShadow: '0 4px 14px var(--color-accent-glow)'
                            }
                          : {
                              borderColor: 'var(--color-border)',
                              backgroundColor: 'var(--color-bg-card-solid)'
                            }
                      }
                    >
                      <div className="flex items-center justify-between w-full mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{theme.icon}</span>
                          <span className="font-bold text-xs">{theme.name}</span>
                        </div>
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full text-white flex items-center justify-center font-bold"
                            style={{ backgroundColor: 'var(--color-accent)' }}
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      <p className="text-[11px] opacity-75 mb-3">{theme.description}</p>

                      {/* Color swatches palette preview bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-black/5">
                        <div className="flex items-center gap-1">
                          {(theme.swatches || [theme.bgColor, theme.surfaceColor, theme.primaryColor]).map((color, idx) => (
                            <div
                              key={idx}
                              className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono opacity-60 ml-auto">
                          {theme.category === 'light' ? 'Luminoso' : 'Oscuro'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BORDER RADIUS & DENSITY & CARD STYLES */}
          {activeTab === 'layout' && (
            <div className="space-y-6">
              {/* Border Radius (Márgenes Redondeados) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold">1. Curvatura de Bordes (Border Radius)</h3>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-accent)' }}>
                    {BORDER_RADIUS_OPTIONS.find((r) => r.id === localSettings.borderRadius)?.label}
                  </span>
                </div>
                <p className="opacity-75 text-xs mb-3">
                  Controla la redondez armónica de tarjetas, botones, modales y campos.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {BORDER_RADIUS_OPTIONS.map((option) => {
                    const isSelected = localSettings.borderRadius === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleUpdate({ borderRadius: option.id })}
                        className="p-3 text-center border transition-all flex flex-col items-center gap-2"
                        style={{
                          borderRadius: option.value,
                          borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-active-col)' : 'var(--color-bg-card-solid)'
                        }}
                      >
                        {/* Interactive Preview Shape */}
                        <div
                          className="w-8 h-8 border-2 flex items-center justify-center"
                          style={{
                            borderRadius: option.value,
                            borderColor: 'var(--color-accent)',
                            backgroundColor: 'var(--color-accent-glow)'
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />}
                        </div>
                        <div>
                          <div className="font-bold text-xs">{option.label}</div>
                          <div className="text-[10px] opacity-60">{option.value}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Information Density */}
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold">2. Densidad de Información</h3>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--color-accent)' }}>
                    {DENSITY_OPTIONS.find((d) => d.id === localSettings.density)?.label}
                  </span>
                </div>
                <p className="opacity-75 text-xs mb-3">
                  Ajusta el espaciado y altura de celdas para aprovechar al máximo tu pantalla.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {DENSITY_OPTIONS.map((option) => {
                    const isSelected = localSettings.density === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleUpdate({ density: option.id })}
                        className="p-3 text-left rounded-xl border transition-all"
                        style={{
                          borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-active-col)' : 'var(--color-bg-card-solid)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{option.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />}
                        </div>
                        <p className="text-[11px] opacity-75">{option.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card Styles */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-bold mb-1">3. Estilo de Acabado de Tarjetas</h3>
                <p className="opacity-75 text-xs mb-3">
                  Selecciona la textura y tratamiento de las superficies.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {CARD_STYLES.map((style) => {
                    const isSelected = localSettings.cardStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => handleUpdate({ cardStyle: style.id })}
                        className="p-3 text-left rounded-xl border transition-all"
                        style={{
                          borderColor: isSelected ? 'var(--color-accent)' : 'var(--color-border)',
                          backgroundColor: isSelected ? 'var(--color-active-col)' : 'var(--color-bg-card-solid)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs">{style.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />}
                        </div>
                        <p className="text-[11px] opacity-75">{style.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TABLE VISUAL HIERARCHY */}
          {activeTab === 'table' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold mb-1">Jerarquía Visual & Guías de Lectura</h3>
                <p className="opacity-75 text-xs">
                  Opciones diseñadas para evitar perderte entre múltiples columnas y filas de montos repetidos.
                </p>
              </div>

              <div className="space-y-3">
                {/* 1. Highlight Active Month */}
                <label
                  className="flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card-solid)'
                  }}
                >
                  <div className="pr-4">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>Resaltar Columna del Mes Seleccionado</span>
                      <span
                        className="px-1.5 py-0.5 rounded text-[10px] font-mono"
                        style={{
                          backgroundColor: 'var(--color-accent-glow)',
                          color: 'var(--color-accent)'
                        }}
                      >
                        Recomendado
                      </span>
                    </div>
                    <p className="text-[11px] opacity-75 mt-1">
                      Destaca la columna correspondiente al mes activo con marco distintivo y badge "★ ACTIVO".
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.highlightActiveMonth}
                    onChange={(e) => handleUpdate({ highlightActiveMonth: e.target.checked })}
                    className="w-4 h-4 rounded mt-0.5"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                </label>

                {/* 2. Zebra Striping */}
                <label
                  className="flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card-solid)'
                  }}
                >
                  <div className="pr-4">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>Filas Alternadas con Sombreado (Zebra Striping)</span>
                    </div>
                    <p className="text-[11px] opacity-75 mt-1">
                      Aplica un tono suave en filas pares para facilitar el seguimiento horizontal.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.zebraStripes}
                    onChange={(e) => handleUpdate({ zebraStripes: e.target.checked })}
                    className="w-4 h-4 rounded mt-0.5"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                </label>

                {/* 3. Crosshair Hover */}
                <label
                  className="flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card-solid)'
                  }}
                >
                  <div className="pr-4">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>Guía Cruzada de Cursor (Crosshair Tracking)</span>
                    </div>
                    <p className="text-[11px] opacity-75 mt-1">
                      Ilumina simultáneamente la fila y la columna al posar el ratón sobre cualquier celda.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.crosshairHover}
                    onChange={(e) => handleUpdate({ crosshairHover: e.target.checked })}
                    className="w-4 h-4 rounded mt-0.5"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                </label>

                {/* 4. Mini Progress Badge per Row */}
                <label
                  className="flex items-start justify-between p-3.5 rounded-xl border cursor-pointer transition-all"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card-solid)'
                  }}
                >
                  <div className="pr-4">
                    <div className="font-bold text-xs flex items-center gap-2">
                      <span>Barra / Badge de Progreso Anual por Gasto</span>
                    </div>
                    <p className="text-[11px] opacity-75 mt-1">
                      Muestra cuántos meses han sido pagados en el año (ej. 8/12 pagados) junto a cada gasto.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showProgressMini}
                    onChange={(e) => handleUpdate({ showProgressMini: e.target.checked })}
                    className="w-4 h-4 rounded mt-0.5"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: MINIMALIST MODE & VISIBILITY */}
          {activeTab === 'visibility' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold mb-1">Modo Minimalista & Reducción de Saturación</h3>
                <p className="opacity-75 text-xs">
                  Si prefieres una pantalla más despejada y directa al grano, activa el modo minimalista o ajusta la visibilidad de widgets.
                </p>
              </div>

              {/* Master Minimalist Mode Switch */}
              <div
                className="p-4 rounded-xl border transition-all flex items-center justify-between"
                style={{
                  borderColor: localSettings.minimalistMode ? 'var(--color-accent)' : 'var(--color-border)',
                  backgroundColor: localSettings.minimalistMode ? 'var(--color-active-col)' : 'var(--color-bg-card-solid)'
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      backgroundColor: 'var(--color-accent)',
                      color: '#ffffff'
                    }}
                  >
                    {localSettings.minimalistMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Modo Minimalista / Focus</h4>
                    <p className="text-[11px] opacity-75">
                      Oculta widgets secundarios decorativos y maximiza el área visual de la tabla y datos directos.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleUpdate({ minimalistMode: !localSettings.minimalistMode })}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all"
                  style={
                    localSettings.minimalistMode
                      ? {
                          backgroundColor: 'var(--color-accent)',
                          color: '#ffffff',
                          boxShadow: '0 4px 12px var(--color-accent-glow)'
                        }
                      : {
                          backgroundColor: 'var(--color-table-head)',
                          color: 'var(--color-text-main)',
                          border: '1px solid var(--color-border)'
                        }
                  }
                >
                  {localSettings.minimalistMode ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              {/* Granular Visibility Toggles */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-xs uppercase tracking-wider opacity-60">
                  Visibilidad de Componentes Superiores
                </h4>

                {/* Show/Hide KPI Cards */}
                <label
                  className="flex items-center justify-between p-3 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card-solid)'
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Grid className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span className="font-bold text-xs">Tarjetas de Métricas KPI (Sueldo, Gastos, Balance)</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showKpiCards}
                    onChange={(e) => handleUpdate({ showKpiCards: e.target.checked })}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                </label>

                {/* Show/Hide Upcoming Due Widget */}
                <label
                  className="flex items-center justify-between p-3 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: 'var(--color-border)',
                    backgroundColor: 'var(--color-bg-card-solid)'
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <Table className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                    <span className="font-bold text-xs">Widget de Cronograma & Próximos Vencimientos</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={localSettings.showUpcomingWidget}
                    onChange={(e) => handleUpdate({ showUpcomingWidget: e.target.checked })}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold opacity-70 hover:opacity-100 hover:text-rose-500 transition-all"
            title="Restablecer a valores por defecto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restablecer</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="metallic-btn-gold px-5 py-2 rounded-xl text-xs font-bold shadow-lg"
            >
              Listo / Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
