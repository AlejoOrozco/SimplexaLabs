import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = { children: React.ReactNode };

/**
 * Renders children only when user is NOT logged in.
 * When logged in, redirects to /meetings.
 */
export function GuestOnly({ children }: Props) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "50vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Cargando…
      </div>
    );
  }

  if (user) {
    return <Navigate to="/meetings" replace />;
  }

  return <>{children}</>;
}
