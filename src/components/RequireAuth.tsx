import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { sileo } from "sileo";
import { useAuth } from "../hooks/useAuth";

const NOT_RECOGNIZED_MESSAGE = "No estás reconocido como usuario. Si fuiste invitado, usa el correo con el que te invitaron. Si no, contacta al administrador para obtener acceso.";

export function RequireAuth() {
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && user && !profile) {
      sileo.error({
        title: "Acceso no autorizado",
        description: NOT_RECOGNIZED_MESSAGE,
      });
    }
  }, [loading, user, profile]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Cargando…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user && !profile) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
