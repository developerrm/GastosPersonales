import React, { useState } from 'react';
import {
  X,
  Database,
  Copy,
  Check,
  Download,
  Code,
  Table,
  Layers,
  Server
} from 'lucide-react';
import { generateMySQLDump } from '../services/sqlExporter';
import { storageService } from '../services/storageService';

export const SqlMigrationModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('sql'); // 'sql' | 'tables' | 'backend'

  if (!isOpen) return null;

  const fullData = storageService.exportAllData();
  const sqlContent = generateMySQLDump(fullData);

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finanztitan_mysql_dump_${new Date().toISOString().split('T')[0]}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const backendCodeSnippet = `// server.js - Backend Ligero Node.js Express + MySQL2
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Pool de conexión a MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'finanztitan',
  waitForConnections: true,
  connectionLimit: 10
});

// Rutas API CRUD
app.get('/api/expenses', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM expenses WHERE is_active = 1');
  res.json(rows);
});

app.post('/api/expenses', async (req, res) => {
  const { id, name, bank_id, category_id, billing_day, due_day, estimated_amount, notes } = req.body;
  await pool.query(
    'INSERT INTO expenses (id, name, bank_id, category_id, billing_day, due_day, estimated_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, bank_id, category_id, billing_day, due_day, estimated_amount, notes]
  );
  res.json({ success: true, id });
});

app.post('/api/payments', async (req, res) => {
  const { expense_id, month_key, amount, status, paid_date, notes } = req.body;
  await pool.query(
    'INSERT INTO monthly_expense_payments (expense_id, month_key, amount, status, paid_date, notes) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE amount = VALUES(amount), status = VALUES(status), paid_date = VALUES(paid_date), notes = VALUES(notes)',
    [expense_id, month_key, amount, status, paid_date, notes]
  );
  res.json({ success: true });
});

app.listen(5000, () => console.log('FinanzTitan API corriendo en puerto 5000 🚀'));`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="metallic-card-surface glass-modal w-full max-w-4xl p-6 rounded-2xl border border-white/20 shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/15 text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Migración a Base de Datos MySQL Ligera
              </h2>
              <p className="text-xs text-metal-400">
                Script SQL con schema relacional completo y datos actuales listos para importar en phpMyAdmin, DBeaver o MySQL CLI.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-metal-400 hover:text-white hover:bg-metal-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'sql'
                ? 'metallic-btn-cyan text-white shadow-sm'
                : 'bg-metal-950 text-metal-400 border border-white/5 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Script SQL Completo (.sql)</span>
          </button>

          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'tables'
                ? 'metallic-btn-cyan text-white shadow-sm'
                : 'bg-metal-950 text-metal-400 border border-white/5 hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Estructura de Tablas</span>
          </button>

          <button
            onClick={() => setActiveTab('backend')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'backend'
                ? 'metallic-btn-cyan text-white shadow-sm'
                : 'bg-metal-950 text-metal-400 border border-white/5 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Backend Express Ejemplo</span>
          </button>
        </div>

        {/* Tab 1: SQL Dump */}
        {activeTab === 'sql' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-metal-950 px-3 py-2 rounded-xl border border-white/10 text-xs">
              <span className="text-metal-400 font-mono">
                Tablas incluidas: banks, categories, expenses, monthly_incomes, monthly_expense_payments
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-metal-800 hover:bg-metal-700 text-white font-semibold flex items-center gap-1.5 transition-all text-xs border border-white/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-sky-400" />
                      <span>Copiar SQL</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  className="metallic-btn-gold px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar .sql</span>
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-metal-950/90 font-mono text-xs">
              <pre className="p-4 text-metal-300 max-h-[380px] overflow-y-auto scrollbar-thin selection:bg-sky-500/30">
                <code>{sqlContent}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Table Schema Guide */}
        {activeTab === 'tables' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto p-1">
            <div className="bg-metal-950/80 p-4 rounded-xl border border-white/10">
              <h4 className="font-mono font-bold text-amber-300 text-xs mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5" /> 1. TABLA: expenses
              </h4>
              <p className="text-xs text-metal-400 mb-2">Gastos fijos base con corte y fecha máxima de pago.</p>
              <ul className="text-[11px] font-mono text-metal-300 space-y-1">
                <li>• <span className="text-sky-300">id</span> VARCHAR(50) PRIMARY KEY</li>
                <li>• <span className="text-sky-300">name</span> VARCHAR(150) (Ej. LUZ, ETF)</li>
                <li>• <span className="text-sky-300">bank_id</span> VARCHAR(50) FK - banks</li>
                <li>• <span className="text-sky-300">category_id</span> VARCHAR(50) FK - categories</li>
                <li>• <span className="text-sky-300">billing_day</span> INT (Día de corte 1-31)</li>
                <li>• <span className="text-sky-300">due_day</span> INT (Fecha máxima 1-31)</li>
                <li>• <span className="text-sky-300">estimated_amount</span> DECIMAL(10,2)</li>
              </ul>
            </div>

            <div className="bg-metal-950/80 p-4 rounded-xl border border-white/10">
              <h4 className="font-mono font-bold text-emerald-300 text-xs mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5" /> 2. TABLA: monthly_expense_payments
              </h4>
              <p className="text-xs text-metal-400 mb-2">Historial y estado de pagos mes a mes.</p>
              <ul className="text-[11px] font-mono text-metal-300 space-y-1">
                <li>• <span className="text-sky-300">id</span> INT AUTO_INCREMENT PRIMARY KEY</li>
                <li>• <span className="text-sky-300">expense_id</span> VARCHAR(50) FK - expenses</li>
                <li>• <span className="text-sky-300">month_key</span> VARCHAR(7) (Ej. 2026-09)</li>
                <li>• <span className="text-sky-300">amount</span> DECIMAL(10,2)</li>
                <li>• <span className="text-sky-300">status</span> ENUM('pending', 'paid', 'partial')</li>
                <li>• <span className="text-sky-300">paid_date</span> DATE NULL</li>
              </ul>
            </div>

            <div className="bg-metal-950/80 p-4 rounded-xl border border-white/10">
              <h4 className="font-mono font-bold text-sky-300 text-xs mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5" /> 3. TABLA: monthly_incomes
              </h4>
              <p className="text-xs text-metal-400 mb-2">Sueldos y proyecciones de ingresos por mes.</p>
              <ul className="text-[11px] font-mono text-metal-300 space-y-1">
                <li>• <span className="text-sky-300">month_key</span> VARCHAR(7) UNIQUE (YYYY-MM)</li>
                <li>• <span className="text-sky-300">base_salary</span> DECIMAL(10,2)</li>
                <li>• <span className="text-sky-300">extra_income</span> DECIMAL(10,2)</li>
                <li>• <span className="text-sky-300">notes</span> VARCHAR(255)</li>
              </ul>
            </div>

            <div className="bg-metal-950/80 p-4 rounded-xl border border-white/10">
              <h4 className="font-mono font-bold text-purple-300 text-xs mb-2 flex items-center gap-1.5">
                <Table className="w-3.5 h-3.5" /> 4. TABLA: banks
              </h4>
              <p className="text-xs text-metal-400 mb-2">Bancos e instituciones financieras asociadas.</p>
              <ul className="text-[11px] font-mono text-metal-300 space-y-1">
                <li>• <span className="text-sky-300">id</span> VARCHAR(50) (pichincha, bolivariano...)</li>
                <li>• <span className="text-sky-300">name</span> VARCHAR(100)</li>
                <li>• <span className="text-sky-300">color</span> VARCHAR(20)</li>
                <li>• <span className="text-sky-300">account_type</span> VARCHAR(100)</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: Node Backend Snippet */}
        {activeTab === 'backend' && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-metal-950 border border-white/10 text-xs text-metal-300">
              Para migrar a un backend real con MySQL, solo necesitas instalar <code className="text-amber-400">express mysql2 cors</code> y conectar tu frontend apuntando al backend.
            </div>
            <div className="relative rounded-xl overflow-hidden border border-white/10 bg-metal-950/90 font-mono text-xs">
              <pre className="p-4 text-sky-200 max-h-[350px] overflow-y-auto scrollbar-thin">
                <code>{backendCodeSnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/10 mt-4">
          <button
            onClick={onClose}
            className="metallic-btn-silver px-5 py-2 rounded-xl text-xs font-bold"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
