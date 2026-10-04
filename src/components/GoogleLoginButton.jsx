import { useState } from 'react';
import { loginWithGoogle, saveSession, getToken, clearSession } from '../services/authService';

export default function GoogleLoginButton({ onSuccess, className = '' }) {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);

    if (!window.google || !window.google.accounts) {
      alert('Google SDK no está cargado');
      setLoading(false);
      return;
    }

    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response) => {
        try {
          const data = await loginWithGoogle(response.credential);
          saveSession(data);

          if (onSuccess) {
            onSuccess(data.user);
          } else {
            window.location.href = '/';
          }
        } catch (error) {
          alert(error.message || 'No se pudo iniciar sesión con Google');
        } finally {
          setLoading(false);
        }
      },
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        console.warn('No se pudo mostrar el selector de Google');
      }
    });
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className={[
        'w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60 transition',
        className,
      ].join(' ')}
    >
      {loading ? 'Conectando...' : 'Continuar con Google'}
    </button>
  );
}
