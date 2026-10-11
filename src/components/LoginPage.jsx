import GoogleLoginButton from './GoogleLoginButton';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400">FinanzTitan</p>
          <h1 className="mt-3 text-3xl font-bold text-white">Gastos Personales</h1>
          <p className="mt-3 text-sm text-slate-400">
            Inicia sesión con tu cuenta de Google para acceder a tus gastos, ingresos y reportes.
          </p>
        </div>

        <GoogleLoginButton onSuccess={onLoginSuccess} />

        <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/60 p-3 text-xs text-slate-400">
          Configura <strong>VITE_GOOGLE_CLIENT_ID</strong> y <strong>VITE_API_URL</strong> en el archivo <strong>.env</strong> del frontend.
        </div>
      </div>
    </div>
  );
}
