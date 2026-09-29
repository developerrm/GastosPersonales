import React, { useState, useEffect } from 'react';
import { storageService } from './services/storageService';
import { themeService, DEFAULT_THEME_SETTINGS } from './services/themeService';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MonthSelector } from './components/MonthSelector';
import { MetricCards } from './components/MetricCards';
import { UpcomingDueWidget } from './components/UpcomingDueWidget';
import { MatrixView } from './components/MatrixView';
import { CardsView } from './components/CardsView';
import { CalendarView } from './components/CalendarView';
import { AnalyticsView } from './components/AnalyticsView';
import { BanksManager } from './components/BanksManager';
import { ExpenseModal } from './components/ExpenseModal';
import { IncomeModal } from './components/IncomeModal';
import { QuickPayModal } from './components/QuickPayModal';
import { SqlMigrationModal } from './components/SqlMigrationModal';
import { DataExportModal } from './components/DataExportModal';
import { ThemeCustomizerModal } from './components/ThemeCustomizerModal';

export function App() {
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');

  // Core Data States
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState({});
  const [banks, setBanks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [months, setMonths] = useState([]);

  // Theme & Appearance Customization States
  const [themeSettings, setThemeSettings] = useState(DEFAULT_THEME_SETTINGS);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isKpiCollapsed, setIsKpiCollapsed] = useState(false);
  const [isDueWidgetCollapsed, setIsDueWidgetCollapsed] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isQuickPayModalOpen, setIsQuickPayModalOpen] = useState(false);
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState(null);
  const [quickPayExpense, setQuickPayExpense] = useState(null);

  // Load Initial Data & Theme
  const loadData = () => {
    const loadedExpenses = storageService.getExpenses();
    const loadedIncomes = storageService.getIncomes();
    const loadedBanks = storageService.getBanks();
    const loadedCategories = storageService.getCategories();
    const loadedMonths = storageService.getMonths();

    setExpenses(loadedExpenses);
    setIncomes(loadedIncomes);
    setBanks(loadedBanks);
    setCategories(loadedCategories);
    setMonths(loadedMonths);

    // Initialize Theme settings
    const loadedTheme = themeService.getSettings();
    setThemeSettings(loadedTheme);
    themeService.applyToDOM(loadedTheme);
    if (loadedTheme.minimalistMode) {
      setIsKpiCollapsed(true);
      setIsDueWidgetCollapsed(true);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- HANDLERS ---
  const handleSaveThemeSettings = (newSettings) => {
    setThemeSettings(newSettings);
    themeService.saveSettings(newSettings);
    if (newSettings.minimalistMode) {
      setIsKpiCollapsed(true);
      setIsDueWidgetCollapsed(true);
    }
  };

  const handleToggleMinimalist = () => {
    const nextState = !themeSettings.minimalistMode;
    const updated = {
      ...themeSettings,
      minimalistMode: nextState
    };
    setThemeSettings(updated);
    themeService.saveSettings(updated);
    setIsKpiCollapsed(nextState);
    setIsDueWidgetCollapsed(nextState);
  };

  const handleSaveExpense = (expenseData) => {
    const updated = storageService.saveExpense(expenseData);
    setExpenses(updated);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto fijo?')) {
      const updated = storageService.deleteExpense(id);
      setExpenses(updated);
    }
  };

  const handleDuplicateExpense = (exp) => {
    const duplicate = {
      ...exp,
      id: `exp-${Date.now()}`,
      name: `${exp.name} (Copia)`
    };
    const updated = storageService.saveExpense(duplicate);
    setExpenses(updated);
  };

  const handleUpdatePayment = (expenseId, monthKey, paymentData) => {
    const updated = storageService.updateMonthlyPayment(expenseId, monthKey, paymentData);
    setExpenses(updated);
  };

  const handleSaveIncome = (monthKey, incomeData) => {
    const updated = storageService.updateMonthlyIncome(monthKey, incomeData);
    setIncomes(updated);
  };

  const handleSaveBank = (bankData) => {
    const updated = storageService.saveBank(bankData);
    setBanks(updated);
  };

  const handleDeleteBank = (bankId) => {
    if (window.confirm('¿Eliminar esta institución bancaria?')) {
      const updated = storageService.deleteBank(bankId);
      setBanks(updated);
    }
  };

  const handleAddNewMonth = (monthObj) => {
    const updated = storageService.addMonth(monthObj);
    setMonths(updated);
  };

  const handleOpenEditExpense = (exp) => {
    setEditingExpense(exp);
    setIsExpenseModalOpen(true);
  };

  const handleOpenQuickPay = (exp) => {
    setQuickPayExpense(exp);
    setIsQuickPayModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-metal-950 text-metal-100 flex flex-col antialiased selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. Desktop Lateral Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        themeSettings={themeSettings}
        onOpenExpenseModal={() => {
          setEditingExpense(null);
          setIsExpenseModalOpen(true);
        }}
        onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
        onOpenSqlModal={() => setIsSqlModalOpen(true)}
        onOpenDataModal={() => setIsDataModalOpen(true)}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onToggleMinimalist={handleToggleMinimalist}
        isSidebarCollapsed={isSidebarCollapsed}
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* 2. Mobile Header Navigation */}
      <div className="md:hidden">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          months={months}
          themeSettings={themeSettings}
          onOpenExpenseModal={() => {
            setEditingExpense(null);
            setIsExpenseModalOpen(true);
          }}
          onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
          onOpenSqlModal={() => setIsSqlModalOpen(true)}
          onOpenDataModal={() => setIsDataModalOpen(true)}
          onOpenBanksModal={() => setActiveTab('banks')}
          onOpenThemeModal={() => setIsThemeModalOpen(true)}
          onToggleMinimalist={handleToggleMinimalist}
        />
      </div>

      {/* 3. Main Content Wrapper with dynamic left margin for Sidebar */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'md:ml-20' : 'md:ml-64'}`}>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
          {/* Month Selector Timeline */}
          <MonthSelector
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          months={months}
          onAddNewMonth={handleAddNewMonth}
        />

        {/* 5 KPI Metric Cards (With Collapse & Minimalist Modes) */}
        {themeSettings.showKpiCards !== false && (
          <MetricCards
            expenses={expenses}
            incomes={incomes}
            selectedMonth={selectedMonth}
            banks={banks}
            onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
            onSelectExpense={handleOpenQuickPay}
            isCollapsed={isKpiCollapsed}
            onToggleCollapse={() => setIsKpiCollapsed(!isKpiCollapsed)}
          />
        )}

        {/* Upcoming Due Date Strip / Chronogram (always visible or on relevant tabs) */}
        {activeTab !== 'analytics' && activeTab !== 'banks' && themeSettings.showUpcomingWidget !== false && (
          <UpcomingDueWidget
            expenses={expenses}
            banks={banks}
            selectedMonth={selectedMonth}
            onQuickPay={handleOpenQuickPay}
            onEditExpense={handleOpenEditExpense}
            isCollapsed={isDueWidgetCollapsed}
            onToggleCollapse={() => setIsDueWidgetCollapsed(!isDueWidgetCollapsed)}
          />
        )}

        {/* Dynamic Tab Views */}
        <div className="pt-1">
          {activeTab === 'matrix' && (
            <MatrixView
              expenses={expenses}
              incomes={incomes}
              months={months}
              banks={banks}
              categories={categories}
              selectedMonth={selectedMonth}
              themeSettings={themeSettings}
              onUpdatePayment={handleUpdatePayment}
              onOpenExpenseModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onEditExpense={handleOpenEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onOpenIncomeModal={() => setIsIncomeModalOpen(true)}
            />
          )}

          {activeTab === 'cards' && (
            <CardsView
              expenses={expenses}
              banks={banks}
              categories={categories}
              selectedMonth={selectedMonth}
              onOpenExpenseModal={() => {
                setEditingExpense(null);
                setIsExpenseModalOpen(true);
              }}
              onEditExpense={handleOpenEditExpense}
              onDeleteExpense={handleDeleteExpense}
              onDuplicateExpense={handleDuplicateExpense}
              onQuickPay={handleOpenQuickPay}
            />
          )}

          {activeTab === 'calendar' && (
            <CalendarView
              expenses={expenses}
              banks={banks}
              selectedMonth={selectedMonth}
              onQuickPay={handleOpenQuickPay}
              onEditExpense={handleOpenEditExpense}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              expenses={expenses}
              incomes={incomes}
              months={months}
              banks={banks}
              categories={categories}
              selectedMonth={selectedMonth}
            />
          )}

          {activeTab === 'banks' && (
            <BanksManager
              banks={banks}
              categories={categories}
              expenses={expenses}
              onSaveBank={handleSaveBank}
              onDeleteBank={handleDeleteBank}
              onSaveCategory={() => {}}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-white/10 bg-metal-950/80 text-center text-xs text-metal-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-metal-300">FinanzTitan</span>
            <span>•</span>
            <span>Gestor de Gastos Fijos & Fechas</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsThemeModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              🎨 Personalizar Tema
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSqlModalOpen(true)}
              className="hover:text-sky-400 transition-colors"
            >
              Schema MySQL
            </button>
            <span>•</span>
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="hover:text-emerald-400 transition-colors"
            >
              Exportar Datos
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        themeSettings={themeSettings}
        onSaveThemeSettings={handleSaveThemeSettings}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
        editingExpense={editingExpense}
        banks={banks}
        categories={categories}
      />

      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        selectedMonth={selectedMonth}
        incomes={incomes}
        onSaveIncome={handleSaveIncome}
      />

      <QuickPayModal
        isOpen={isQuickPayModalOpen}
        onClose={() => setIsQuickPayModalOpen(false)}
        expense={quickPayExpense}
        selectedMonth={selectedMonth}
        banks={banks}
        onSavePayment={handleUpdatePayment}
      />

      <SqlMigrationModal
        isOpen={isSqlModalOpen}
        onClose={() => setIsSqlModalOpen(false)}
      />

      <DataExportModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
        expenses={expenses}
        months={months}
        onDataReloaded={loadData}
      />
    </div>
    </div>
  );
}

export default App;
