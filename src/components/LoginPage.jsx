import GoogleLoginButton from './GoogleLoginButton';

export default function LoginPage({ onLoginSuccess }) {
  return (
    <div className="login-bg min-h-screen text-slate-800 flex items-center justify-center px-4 relative overflow-hidden">
      <style>{`
        .login-bg { background: linear-gradient(135deg, #f8fafc, #eef2ff, #f0fdf4); background-size: 300% 300%; animation: loginGradient 14s ease infinite; }
        @keyframes loginGradient { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes loginFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-18px); } }
        @keyframes loginFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .login-card { animation: loginFadeUp .7s ease both; }
        .login-orb { animation: loginFloat 8s ease-in-out infinite; }
      `}</style>
      <div className="login-orb absolute -top-16 -left-16 h-64 w-64 rounded-full bg-indigo-200/50 blur-3xl" />
      <div className="login-orb absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" style={{ animationDelay: '-4s' }} />

      <div className="login-card relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.25em] text-indigo-500">FinanzTitan</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-900">Gastos Personales</h1>
          <p className="mt-3 text-sm text-slate-500">
            Inicia sesión con tu cuenta de Google para acceder a tus gastos, ingresos y reportes.
          </p>
        </div>

        <GoogleLoginButton onSuccess={onLoginSuccess} />
      </div>
    </div>
  );
}
