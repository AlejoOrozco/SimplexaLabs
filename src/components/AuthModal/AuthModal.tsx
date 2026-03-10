import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { sileo } from "sileo";
import { useAuth } from "../../hooks/useAuth";
import "./AuthModal.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

function GoogleIcon() {
  return (
    <svg
      className="auth-modal__google-icon"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthModal({ isOpen, onClose }: Props) {
  const navigate = useNavigate();
  const { user, profile, signInWithGoogle, error, clearError } = useAuth();

  const handleClose = useCallback(() => {
    clearError();
    onClose();
  }, [onClose, clearError]);

  // Redirect only when user is fully registered (has profile).
  useEffect(() => {
    if (isOpen && user && profile) {
      onClose();
      navigate("/meetings");
    }
  }, [isOpen, user, profile, onClose, navigate]);

  const handleGoogleClick = useCallback(async () => {
    clearError();
    try {
      await signInWithGoogle();
      handleClose();
      navigate("/meetings");
    } catch (err) {
      const code =
        err && typeof err === "object" && "code" in err
          ? (err as { code?: string }).code
          : undefined;

      if (code === "auth/not-recognized") {
        sileo.error({
          title: "Acceso no autorizado",
          description:
            "No estás reconocido como usuario. Si fuiste invitado, usa el correo con el que te invitaron. Si no, contacta al administrador.",
        });
        handleClose();
        return;
      }

      if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
        sileo.error({
          title: "Inicio de sesión cancelado",
          description: "No se completó el inicio de sesión con Google. Intenta de nuevo.",
        });
        return;
      }

      if (code === "auth/popup-blocked") {
        sileo.error({
          title: "Ventana bloqueada",
          description:
            "Tu navegador bloqueó la ventana de Google. Permite ventanas emergentes o abre esta página en el navegador del sistema y vuelve a intentar.",
        });
        return;
      }

      sileo.error({
        title: "Error al iniciar sesión",
        description: "No se pudo iniciar sesión con Google. Intenta de nuevo.",
      });
    }
  }, [signInWithGoogle, handleClose, clearError, navigate]);

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="auth-modal-backdrop"
      onClick={handleClose}
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="auth-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && handleClose()}
      >
        <button
          type="button"
          className="auth-modal__close"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 id="auth-modal-title" className="auth-modal__title">
          Iniciar sesión
        </h2>
        <p className="auth-modal__subtitle">
          Accede con tu cuenta de Google para continuar
        </p>

        {error && (
          <div className="auth-modal__error" role="alert">
            {error}
          </div>
        )}

        <button
          type="button"
          className="auth-modal__google-btn"
          onClick={() => void handleGoogleClick()}
        >
          <GoogleIcon />
          Continuar con Google
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
