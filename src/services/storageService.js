import {
  INITIAL_BANKS,
  INITIAL_CATEGORIES,
  INITIAL_EXPENSES,
  INITIAL_INCOMES,
  INITIAL_MONTHS
} from '../data/initialData';

const KEYS = {
  EXPENSES: 'finanztitan_expenses_v1',
  INCOMES: 'finanztitan_incomes_v1',
  BANKS: 'finanztitan_banks_v1',
  CATEGORIES: 'finanztitan_categories_v1',
  MONTHS: 'finanztitan_months_v1'
};

export const storageService = {
  // --- EXPENSES ---
  getExpenses: () => {
    try {
      const data = localStorage.getItem(KEYS.EXPENSES);
      if (data) return JSON.parse(data);
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(INITIAL_EXPENSES));
      return INITIAL_EXPENSES;
    } catch (e) {
      console.error('Error reading expenses from storage', e);
      return INITIAL_EXPENSES;
    }
  },

  saveExpenses: (expenses) => {
    try {
      localStorage.setItem(KEYS.EXPENSES, JSON.stringify(expenses));
      return true;
    } catch (e) {
      console.error('Error saving expenses', e);
      return false;
    }
  },

  saveExpense: (expense) => {
    const expenses = storageService.getExpenses();
    const index = expenses.findIndex((item) => item.id === expense.id);
    let updated;
    if (index >= 0) {
      updated = [...expenses];
      updated[index] = { ...updated[index], ...expense };
    } else {
      const newExp = {
        ...expense,
        id: expense.id || `exp-${Date.now()}`
      };
      updated = [...expenses, newExp];
    }
    storageService.saveExpenses(updated);
    return updated;
  },

  deleteExpense: (id) => {
    const expenses = storageService.getExpenses();
    const updated = expenses.filter((e) => e.id !== id);
    storageService.saveExpenses(updated);
    return updated;
  },

  updateMonthlyPayment: (expenseId, monthKey, paymentData) => {
    const expenses = storageService.getExpenses();
    const updated = expenses.map((exp) => {
      if (exp.id === expenseId) {
        const currentPayments = exp.monthlyPayments || {};
        return {
          ...exp,
          monthlyPayments: {
            ...currentPayments,
            [monthKey]: {
              ...(currentPayments[monthKey] || {}),
              ...paymentData
            }
          }
        };
      }
      return exp;
    });
    storageService.saveExpenses(updated);
    return updated;
  },

  // --- INCOMES ---
  getIncomes: () => {
    try {
      const data = localStorage.getItem(KEYS.INCOMES);
      if (data) return JSON.parse(data);
      localStorage.setItem(KEYS.INCOMES, JSON.stringify(INITIAL_INCOMES));
      return INITIAL_INCOMES;
    } catch (e) {
      console.error('Error reading incomes', e);
      return INITIAL_INCOMES;
    }
  },

  saveIncomes: (incomes) => {
    try {
      localStorage.setItem(KEYS.INCOMES, JSON.stringify(incomes));
      return true;
    } catch (e) {
      console.error('Error saving incomes', e);
      return false;
    }
  },

  updateMonthlyIncome: (monthKey, incomeData) => {
    const incomes = storageService.getIncomes();
    const updated = {
      ...incomes,
      [monthKey]: {
        ...(incomes[monthKey] || { baseSalary: 1000, extraIncome: 0 }),
        ...incomeData
      }
    };
    storageService.saveIncomes(updated);
    return updated;
  },

  // --- BANKS ---
  getBanks: () => {
    try {
      const data = localStorage.getItem(KEYS.BANKS);
      if (data) return JSON.parse(data);
      localStorage.setItem(KEYS.BANKS, JSON.stringify(INITIAL_BANKS));
      return INITIAL_BANKS;
    } catch (e) {
      return INITIAL_BANKS;
    }
  },

  saveBanks: (banks) => {
    try {
      localStorage.setItem(KEYS.BANKS, JSON.stringify(banks));
      return true;
    } catch (e) {
      return false;
    }
  },

  saveBank: (bank) => {
    const banks = storageService.getBanks();
    const index = banks.findIndex((b) => b.id === bank.id);
    let updated;
    if (index >= 0) {
      updated = [...banks];
      updated[index] = { ...updated[index], ...bank };
    } else {
      const newBank = {
        ...bank,
        id: bank.id || `bank-${Date.now()}`
      };
      updated = [...banks, newBank];
    }
    storageService.saveBanks(updated);
    return updated;
  },

  deleteBank: (bankId) => {
    const banks = storageService.getBanks();
    const updated = banks.filter((b) => b.id !== bankId);
    storageService.saveBanks(updated);
    return updated;
  },

  // --- CATEGORIES ---
  getCategories: () => {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      if (data) return JSON.parse(data);
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    } catch (e) {
      return INITIAL_CATEGORIES;
    }
  },

  saveCategories: (categories) => {
    try {
      localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
      return true;
    } catch (e) {
      return false;
    }
  },

  // --- MONTHS ---
  getMonths: () => {
    try {
      const data = localStorage.getItem(KEYS.MONTHS);
      if (data) return JSON.parse(data);
      localStorage.setItem(KEYS.MONTHS, JSON.stringify(INITIAL_MONTHS));
      return INITIAL_MONTHS;
    } catch (e) {
      return INITIAL_MONTHS;
    }
  },

  saveMonths: (months) => {
    try {
      localStorage.setItem(KEYS.MONTHS, JSON.stringify(months));
      return true;
    } catch (e) {
      return false;
    }
  },

  addMonth: (monthObj) => {
    const months = storageService.getMonths();
    if (months.some((m) => m.key === monthObj.key)) return months;
    const updated = [...months, monthObj].sort((a, b) => a.key.localeCompare(b.key));
    storageService.saveMonths(updated);
    return updated;
  },

  // --- EXPORT & IMPORT ---
  exportAllData: () => {
    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      expenses: storageService.getExpenses(),
      incomes: storageService.getIncomes(),
      banks: storageService.getBanks(),
      categories: storageService.getCategories(),
      months: storageService.getMonths()
    };
  },

  importAllData: (jsonData) => {
    if (!jsonData || typeof jsonData !== 'object') {
      throw new Error('Formato de datos JSON inválido.');
    }
    if (jsonData.expenses) storageService.saveExpenses(jsonData.expenses);
    if (jsonData.incomes) storageService.saveIncomes(jsonData.incomes);
    if (jsonData.banks) storageService.saveBanks(jsonData.banks);
    if (jsonData.categories) storageService.saveCategories(jsonData.categories);
    if (jsonData.months) storageService.saveMonths(jsonData.months);
    return true;
  },

  resetAllData: () => {
    localStorage.removeItem(KEYS.EXPENSES);
    localStorage.removeItem(KEYS.INCOMES);
    localStorage.removeItem(KEYS.BANKS);
    localStorage.removeItem(KEYS.CATEGORIES);
    localStorage.removeItem(KEYS.MONTHS);
    return true;
  }
};
