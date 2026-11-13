import assert from 'node:assert/strict';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { loadPaymentsByExpense } from '../services/monthlyPayments.js';

test('muestra importe y estado pagado en meses inactivos', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { MatrixView } = await server.ssrLoadModule('/src/components/MatrixView.jsx');
    const months = [
      { key: '2026-09', shortLabel: 'Sep' },
      { key: '2026-10', shortLabel: 'Oct' },
      { key: '2026-11', shortLabel: 'Nov' },
    ];
    const payments = {
      '2026-09': [{ id: 'p1', expenseId: 'e1', amount: '42.50', status: 'paid' }],
      '2026-10': [{ id: 'p2', expenseId: 'e1', amount: '0', status: 'paid' }],
      '2026-11': [{ id: 'p3', expenseId: 'e1', amount: null, status: 'pending' }],
    };
    const byExpense = await loadPaymentsByExpense(months.map((month) => month.key), async (key) => payments[key]);
    const props = {
      expenses: [{ id: 'e1', name: 'Luz', estimatedAmount: 30, monthlyPayments: byExpense.get('e1') }],
      incomes: {}, months, banks: [], categories: [], themeSettings: {},
      setSelectedMonth: () => {}, onUpdatePayment: () => {},
    };

    for (const selectedMonth of ['2026-09', '2026-11']) {
      const html = renderToStaticMarkup(React.createElement(MatrixView, { ...props, selectedMonth }));
      const row = html.match(/<tbody[^>]*>.*?<tr[^>]*>(.*?)<\/tr>/s)[1];
      const cells = [...row.matchAll(/<td\b[^>]*>.*?<\/td>/gs)].map((match) => match[0]);
      assert.match(cells[2], /Marcado como pagado.*?\$42\.50/s);
      assert.match(cells[3], /Marcado como pagado.*?\$0\.00/s);
      assert.match(cells[4], /Pendiente.*?\$30\.00/s);
    }
  } finally {
    await server.close();
  }
});
