import { getToken } from './authService';

const getApiUrl = () => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('Configura VITE_API_URL para conectar con el backend.');
  }
  return baseUrl;
};

const request = async (path, options = {}) => {
  const token = getToken();
  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `****** } : {}),
      ...options.headers,
    },
  });

  if (response.status === 204) return null;

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('La sesión venció. Inicia sesión nuevamente.');
    }
    throw new Error(data.error || 'No se pudo completar la solicitud al servidor.');
  }
  return data;
};

const jsonBody = (body) => ({ body: JSON.stringify(body) });

const expenseFields = ({
  name,
  bankId,
  categoryId,
  billingDay,
  dueDay,
  estimatedAmount,
  priority,
  notes,
}) => ({
  name,
  bankId: bankId || null,
  categoryId: categoryId || null,
  billingDay: Number(billingDay),
  dueDay: Number(dueDay),
  estimatedAmount: Number(estimatedAmount),
  priority,
  notes: notes || '',
});

export const apiService = {
  getExpenses: () => request('/expenses'),
  createExpense: (expense) =>
    request('/expenses', { method: 'POST', ...jsonBody(expenseFields(expense)) }),
  updateExpense: (id, expense) =>
    request(`/expenses/${id}`, { method: 'PUT', ...jsonBody(expenseFields(expense)) }),
  deleteExpense: (id) => request(`/expenses/${id}`, { method: 'DELETE' }),

  getPayments: (monthKey) => request(`/payments/${monthKey}`),
  updatePayment: (id, payment) =>
    request(`/payments/${id}`, {
      method: 'PUT',
      ...jsonBody({
        amount: Number(payment.amount),
        status: payment.status,
        paidDate: payment.paidDate || null,
        notes: payment.note || '',
      }),
    }),

  getIncomes: () => request('/incomes'),
  saveIncome: (income) => {
    const body = {
      monthKey: income.monthKey,
      baseSalary: Number(income.baseSalary),
      extraIncome: Number(income.extraIncome),
      notes: income.notes || '',
    };
    return income.id
      ? request(`/incomes/${income.monthKey}`, { method: 'PUT', ...jsonBody(body) })
      : request('/incomes', { method: 'POST', ...jsonBody(body) });
  },

  getBanks: () => request('/banks'),
  createBank: (bank) =>
    request('/banks', {
      method: 'POST',
      ...jsonBody({
        name: bank.name,
        color: bank.color,
        accountType: bank.accountType || null,
        accountNumber: bank.accountNumber || null,
      }),
    }),

  getCategories: () => request('/categories'),
  createCategory: (category) =>
    request('/categories', {
      method: 'POST',
      ...jsonBody({
        name: category.name,
        icon: category.icon,
        color: category.color,
      }),
    }),
};
