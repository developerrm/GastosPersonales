import assert from 'node:assert/strict';
import test from 'node:test';
import { loadPaymentsByExpense } from './monthlyPayments.js';

test('carga pagos de todos los meses por gasto, incluso montos cero', async () => {
  const requested = [];
  const payments = {
    '2026-09': [{ id: 'p1', expenseId: 'e1', amount: '42.50', status: 'paid', paidDate: '2026-09-10T00:00:00Z' }],
    '2026-10': [
      { id: 'p2', expenseId: 'e1', amount: '0', status: 'paid' },
      { id: 'p3', expenseId: 'e2', amount: null, status: 'pending' },
    ],
  };
  const result = await loadPaymentsByExpense(['2026-09', '2026-10', '2026-10'], async (month) => {
    requested.push(month);
    return payments[month];
  });

  assert.deepEqual(requested, ['2026-09', '2026-10']);
  assert.equal(result.get('e1')['2026-09'].id, 'p1');
  assert.equal(result.get('e1')['2026-09'].amount, 42.5);
  assert.equal(result.get('e1')['2026-09'].status, 'paid');
  assert.equal(result.get('e1')['2026-09'].paidDate, '2026-09-10');
  assert.equal(result.get('e1')['2026-10'].amount, 0);
  assert.equal(result.get('e1')['2026-10'].status, 'paid');
  assert.equal(result.get('e2')['2026-10'].amount, null);
});

test('propaga errores al cargar cualquier mes', async () => {
  await assert.rejects(
    loadPaymentsByExpense(['2026-09', '2026-10'], async (month) => {
      if (month === '2026-10') throw new Error('Error al cargar pagos');
      return [];
    }),
    /Error al cargar pagos/
  );
});
