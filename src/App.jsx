import React, { useState, useEffect, useCallback } from 'react';
import { storageService } from './services/storageService';
import { apiService } from './services/apiService';
import { clearSession, getSession } from './services/authService';
import { themeService, DEFAULT_THEME_SETTINGS } from './services/themeService';
import LoginPage from './components/LoginPage';
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

const normalizePayment = (payment) => ({
  ...payment,
  amount: payment.amount == null ? null : Number(payment.amount),
  paidDate: payment.paidDate ? payment.paidDate.slice(0, 10) : null,
  note: payment.notes || '',
});

const normalizeIncome = (income) => ({
  ...income,
  baseSalary: Number(income.baseSalary),
  extraIncome: Number(income.extraIncome),
});

export function App() {
  const [session, setSession] = useState(() => getSession());
  const [activeTab, setActiveTab] = useState('matrix');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [isLoading, setIsLoading] = useState(Boolean(getSession()));
  const [dataError, setDataError] = useState('');

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

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setDataError('');
    try {
      const [loadedExpenses, loadedIncomes, loadedBanks, loadedCategories, loadedPayments] = await Promise.all([
        apiService.getExpenses(),
        apiService.getIncomes(),
        apiService.getBanks(),
        apiService.getCategories(),
        apiService.getPayments(selectedMonth),
      ]);
      const paymentsByExpense = new Map(
        loadedPayments.map((payment) => [payment.expenseId, normalizePayment(payment)])
      );
      const normalizedExpenses = loadedExpenses.map((expense) => ({
        ...expense,
        estimatedAmount: Number(expense.estimatedAmount),
        monthlyPayments: {
          [selectedMonth]: paymentsByExpense.get(expense.id) || {},
        },
      }));
      const normalizedIncomes = Object.fromEntries(
        loadedIncomes.map((income) => [income.monthKey, normalizeIncome(income)])
      );

      setExpenses(normalizedExpenses);
      setIncomes(normalizedIncomes);
      setBanks(loadedBanks);
      setCategories(loadedCategories);
      setMonths(storageService.getMonths());
      storageService.saveExpenses(normalizedExpenses);
      storageService.saveIncomes(normalizedIncomes);
      storageService.saveBanks(loadedBanks);
      storageService.saveCategories(loadedCategories);

      const loadedTheme = themeService.getSettings();
      setThemeSettings(loadedTheme);
      themeService.applyToDOM(loadedTheme);
      if (loadedTheme.minimalistMode) {
        setIsKpiCollapsed(true);
        setIsDueWidgetCollapsed(true);
      }
    } catch (error) {
      if (error.message.startsWith('La sesión venció')) {
        clearSession();
        setSession(null);
      } else {
        setDataError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth]);

  useEffect(() => {
    if (session) loadData();
  }, [session, loadData]);

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

  const handleSaveExpense = async (expenseData) => {
    try {
      const savedExpense = expenseData.id
        ? await apiService.updateExpense(expenseData.id, expenseData)
        : await apiService.createExpense(expenseData);
      setExpenses((current) => {
        const existing = current.find((expense) => expense.id === savedExpense.id);
        const updatedExpense = {
          ...savedExpense,
          estimatedAmount: Number(savedExpense.estimatedAmount),
          monthlyPayments: existing?.monthlyPayments || {},
        };
        const updated = existing
          ? current.map((expense) => expense.id === savedExpense.id ? updatedExpense : expense)
          : [...current, updatedExpense];
        storageService.saveExpenses(updated);
        return updated;
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este gasto fijo?')) {
      apiService.deleteExpense(id).then(() => {
        setExpenses((current) => {
          const updated = current.filter((expense) => expense.id !== id);
          storageService.saveExpenses(updated);
          return updated;
        });
      }).catch((error) => alert(error.message));
    }
  };

  const handleDuplicateExpense = (exp) => {
    const duplicate = {
      ...exp,
      id: `exp-${Date.now()}`,
      name: `${exp.name} (Copia)`
    };
    handleSaveExpense(duplicate);
  };

  const handleUpdatePayment = async (expenseId, monthKey, paymentData) => {
    try {
      const expense = expenses.find((item) => item.id === expenseId);
      const paymentId = expense?.monthlyPayments?.[monthKey]?.id;
      if (!paymentId) throw new Error('No se encontró el pago mensual para actualizar.');
      const savedPayment = normalizePayment(await apiService.updatePayment(paymentId, paymentData));
      setExpenses((current) => {
        const updated = current.map((item) => item.id === expenseId
          ? { ...item, monthlyPayments: { ...item.monthlyPayments, [monthKey]: savedPayment } }
          : item);
        storageService.saveExpenses(updated);
        return updated;
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveIncome = async (monthKey, incomeData) => {
    try {
      const savedIncome = normalizeIncome(await apiService.saveIncome({
        ...incomeData,
        monthKey,
        id: incomes[monthKey]?.id,
      }));
      setIncomes((current) => {
        const updated = { ...current, [monthKey]: savedIncome };
        storageService.saveIncomes(updated);
        return updated;
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveBank = async (bankData) => {
    try {
      const savedBank = await apiService.createBank(bankData);
      setBanks((current) => {
        const updated = [...current, savedBank];
        storageService.saveBanks(updated);
        return updated;
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      const savedCategory = await apiService.createCategory(categoryData);
      setCategories((current) => {
        const updated = [...current, savedCategory];
        storageService.saveCategories(updated);
        return updated;
      });
    } catch (error) {
      alert(error.message);
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

  if (!session) {
    return <LoginPage onLoginSuccess={() => {
      setSession(getSession());
      setIsLoading(true);
    }} />;
  }

  if (isLoading && expenses.length === 0 && !dataError) {
    return (
      <div className="min-h-screen bg-metal-950 text-metal-100 flex items-center justify-center">
        <p className="text-sm text-metal-300">Conectando con tus datos...</p>
      </div>
    );
  }

  if (dataError && expenses.length === 0 && banks.length === 0 && categories.length === 0) {
    return (
      <div className="min-h-screen bg-metal-950 text-metal-100 flex flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-rose-300">{dataError}</p>
        <button onClick={loadData} className="metallic-btn-gold px-4 py-2 rounded-xl text-sm font-bold">
          Reintentar
        </button>
        <button onClick={() => { clearSession(); setSession(null); }} className="text-sm text-metal-400 hover:text-white">
          Cerrar sesión
        </button>
      </div>
    );
  }

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
          {dataError && (
            <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
              {dataError}
            </p>
          )}
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
              onSaveCategory={handleSaveCategory}
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
            <span>•</span>
            <span className="text-metal-400">{session.user.email}</span>
            <button
              onClick={() => { clearSession(); setSession(null); }}
              className="hover:text-rose-400 transition-colors"
            >
              Cerrar sesión
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
      />
    </div>
    </div>
  );
}

export default App;
