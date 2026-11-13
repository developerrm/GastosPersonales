export const normalizePayment = (payment) => ({
  ...payment,
  amount: payment.amount == null ? null : Number(payment.amount),
  paidDate: payment.paidDate ? payment.paidDate.slice(0, 10) : null,
  note: payment.notes || '',
});

export async function loadPaymentsByExpense(monthKeys, getPayments) {
  const paymentsByMonth = await Promise.all(
    [...new Set(monthKeys)].map(async (monthKey) => ({
      monthKey,
      payments: await getPayments(monthKey),
    }))
  );
  const paymentsByExpense = new Map();

  paymentsByMonth.forEach(({ monthKey, payments }) => {
    payments.forEach((payment) => {
      if (!paymentsByExpense.has(payment.expenseId)) {
        paymentsByExpense.set(payment.expenseId, {});
      }
      paymentsByExpense.get(payment.expenseId)[monthKey] = normalizePayment(payment);
    });
  });

  return paymentsByExpense;
}
