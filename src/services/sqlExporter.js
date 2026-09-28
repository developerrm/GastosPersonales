/**
 * Generates SQL DDL and INSERT dump for MySQL / MariaDB migration
 */
export const generateMySQLDump = (data) => {
  const { expenses = [], incomes = {}, banks = [], categories = [], months = [] } = data;

  const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

  let sql = `-- ========================================================
-- FinanzTitan MySQL Database Migration Dump
-- Generado el: ${timestamp}
-- Compatible con: MySQL 8.0+ / MariaDB 10.4+
-- ========================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABLA: banks
DROP TABLE IF EXISTS \`banks\`;
CREATE TABLE \`banks\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`short_name\` VARCHAR(50) DEFAULT NULL,
  \`color\` VARCHAR(20) DEFAULT '#f59e0b',
  \`account_type\` VARCHAR(100) DEFAULT NULL,
  \`account_number\` VARCHAR(50) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABLA: categories
DROP TABLE IF EXISTS \`categories\`;
CREATE TABLE \`categories\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(100) NOT NULL,
  \`icon\` VARCHAR(50) DEFAULT 'Tag',
  \`color\` VARCHAR(20) DEFAULT '#38bdf8',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABLA: expenses (Gastos fijos base)
DROP TABLE IF EXISTS \`expenses\`;
CREATE TABLE \`expenses\` (
  \`id\` VARCHAR(50) NOT NULL,
  \`name\` VARCHAR(150) NOT NULL,
  \`bank_id\` VARCHAR(50) DEFAULT NULL,
  \`category_id\` VARCHAR(50) DEFAULT NULL,
  \`billing_day\` INT DEFAULT 1 COMMENT 'Día de corte o emisión (1-31)',
  \`due_day\` INT DEFAULT 1 COMMENT 'Fecha máxima de pago (1-31)',
  \`estimated_amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`priority\` ENUM('low', 'medium', 'high') DEFAULT 'medium',
  \`notes\` TEXT DEFAULT NULL,
  \`is_active\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  KEY \`idx_bank\` (\`bank_id\`),
  KEY \`idx_category\` (\`category_id\`),
  CONSTRAINT \`fk_expenses_bank\` FOREIGN KEY (\`bank_id\`) REFERENCES \`banks\` (\`id\`) ON DELETE SET NULL,
  CONSTRAINT \`fk_expenses_category\` FOREIGN KEY (\`category_id\`) REFERENCES \`categories\` (\`id\`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABLA: monthly_incomes (Ingresos y sueldos por mes)
DROP TABLE IF EXISTS \`monthly_incomes\`;
CREATE TABLE \`monthly_incomes\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`month_key\` VARCHAR(7) NOT NULL COMMENT 'Formato YYYY-MM',
  \`base_salary\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`extra_income\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`notes\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_month_key\` (\`month_key\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABLA: monthly_expense_payments (Pagos y proyecciones reales por mes)
DROP TABLE IF EXISTS \`monthly_expense_payments\`;
CREATE TABLE \`monthly_expense_payments\` (
  \`id\` INT AUTO_INCREMENT NOT NULL,
  \`expense_id\` VARCHAR(50) NOT NULL,
  \`month_key\` VARCHAR(7) NOT NULL COMMENT 'Formato YYYY-MM',
  \`amount\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`status\` ENUM('pending', 'paid', 'partial') DEFAULT 'pending',
  \`paid_date\` DATE DEFAULT NULL,
  \`notes\` VARCHAR(255) DEFAULT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`),
  UNIQUE KEY \`uk_expense_month\` (\`expense_id\`, \`month_key\`),
  KEY \`idx_payment_month\` (\`month_key\`),
  CONSTRAINT \`fk_payments_expense\` FOREIGN KEY (\`expense_id\`) REFERENCES \`expenses\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- INSERCIÓN DE DATOS ACTUALES
-- ========================================================
\n`;

  // Banks
  if (banks.length > 0) {
    sql += `-- Inserción: banks\nINSERT INTO \`banks\` (\`id\`, \`name\`, \`short_name\`, \`color\`, \`account_type\`, \`account_number\`) VALUES\n`;
    const bankRows = banks.map((b) => {
      return `('${escapeSql(b.id)}', '${escapeSql(b.name)}', '${escapeSql(b.shortName || b.name)}', '${escapeSql(b.color)}', '${escapeSql(b.accountType || '')}', '${escapeSql(b.accountNumber || '')}')`;
    });
    sql += bankRows.join(',\n') + ';\n\n';
  }

  // Categories
  if (categories.length > 0) {
    sql += `-- Inserción: categories\nINSERT INTO \`categories\` (\`id\`, \`name\`, \`icon\`, \`color\`) VALUES\n`;
    const catRows = categories.map((c) => {
      return `('${escapeSql(c.id)}', '${escapeSql(c.name)}', '${escapeSql(c.icon || 'Tag')}', '${escapeSql(c.color || '#38bdf8')}')`;
    });
    sql += catRows.join(',\n') + ';\n\n';
  }

  // Expenses
  if (expenses.length > 0) {
    sql += `-- Inserción: expenses\nINSERT INTO \`expenses\` (\`id\`, \`name\`, \`bank_id\`, \`category_id\`, \`billing_day\`, \`due_day\`, \`estimated_amount\`, \`priority\`, \`notes\`) VALUES\n`;
    const expRows = expenses.map((e) => {
      return `('${escapeSql(e.id)}', '${escapeSql(e.name)}', '${escapeSql(e.bankId)}', '${escapeSql(e.categoryId)}', ${e.billingDay || 1}, ${e.dueDay || 1}, ${parseFloat(e.estimatedAmount) || 0}, '${e.priority || 'medium'}', '${escapeSql(e.notes || '')}')`;
    });
    sql += expRows.join(',\n') + ';\n\n';
  }

  // Incomes
  const incomeKeys = Object.keys(incomes);
  if (incomeKeys.length > 0) {
    sql += `-- Inserción: monthly_incomes\nINSERT INTO \`monthly_incomes\` (\`month_key\`, \`base_salary\`, \`extra_income\`, \`notes\`) VALUES\n`;
    const incRows = incomeKeys.map((key) => {
      const inc = incomes[key];
      return `('${escapeSql(key)}', ${parseFloat(inc.baseSalary) || 0}, ${parseFloat(inc.extraIncome) || 0}, '${escapeSql(inc.notes || '')}')`;
    });
    sql += incRows.join(',\n') + ';\n\n';
  }

  // Payments per month
  const paymentRows = [];
  expenses.forEach((e) => {
    if (e.monthlyPayments) {
      Object.entries(e.monthlyPayments).forEach(([mKey, p]) => {
        paymentRows.push(
          `('${escapeSql(e.id)}', '${escapeSql(mKey)}', ${parseFloat(p.amount) || 0}, '${escapeSql(p.status || 'pending')}', ${p.paidDate ? `'${p.paidDate}'` : 'NULL'}, '${escapeSql(p.note || '')}')`
        );
      });
    }
  });

  if (paymentRows.length > 0) {
    sql += `-- Inserción: monthly_expense_payments\nINSERT INTO \`monthly_expense_payments\` (\`expense_id\`, \`month_key\`, \`amount\`, \`status\`, \`paid_date\`, \`notes\`) VALUES\n`;
    sql += paymentRows.join(',\n') + ';\n\n';
  }

  sql += `SET FOREIGN_KEY_CHECKS = 1;\n-- Fin de la migración\n`;

  return sql;
};

function escapeSql(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/'/g, "''")
    .replace(/\\/g, '\\\\');
}
