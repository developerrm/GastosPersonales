# Gastos Personales 📊💰

Aplicación web interactiva y moderna para la gestión, control y visualización de finanzas y gastos personales.

## 🚀 Características

- **Vista Matriz y Tarjetas**: Organización clara de gastos por mes, categoría y banco.
- **Calendario Financiero**: Visualización de vencimientos y fechas de pago.
- **Analíticas y Gráficos**: Gráficos interactivos de distribución de gastos, comparativas mensuales y métricas clave.
- **Gestión Bancaria**: Administración de cuentas, límites y formas de pago.
- **Pagos Rápidos y Registro de Ingresos**: Control integral de flujos de dinero.
- **Exportación de Datos**: Respaldo de datos en formato JSON y CSV.

## 🔌 Conexión con el backend

La aplicación usa [GastosPersonalesBackend](https://github.com/developerrm/GastosPersonalesBackend) para autenticar usuarios con Google y guardar gastos, pagos, ingresos, bancos y categorías por usuario.

1. Copia `.env.example` a `.env`.
2. Configura `VITE_API_URL` con la URL pública del backend y `VITE_GOOGLE_CLIENT_ID` con el mismo cliente OAuth configurado en el backend.
3. Añade el origen del frontend a `CORS_ORIGINS` en el backend e inicia sesión con Google.

Las preferencias visuales y los meses de navegación permanecen en el almacenamiento local del navegador. Los datos locales que ya existían no se migran ni se sobrescriben automáticamente. La API actual permite crear bancos y categorías, pero no editarlos ni eliminarlos; la restauración de backups todavía no se ofrece desde la interfaz.

## 🛠️ Tecnologías

- **React 18**
- **Vite**
- **Tailwind CSS**
- **Lucide Icons**
- **Recharts**
- **Canvas Confetti**

## 📦 Instalación y Desarrollo Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/developerrm/GastosPersonales.git
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

## 🌐 Despliegue en GitHub Pages

Este repositorio cuenta con un flujo automatizado de CI/CD mediante **GitHub Actions** (`.github/workflows/deploy.yml`) que compila y publica la aplicación automáticamente en GitHub Pages tras cada commit en las ramas principales.
