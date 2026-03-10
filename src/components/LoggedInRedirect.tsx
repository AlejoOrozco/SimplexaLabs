import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type Props = { children: React.ReactNode; to: string };

/**
 * When user is logged in, redirects to `to`.
 * Otherwise renders children.
 */
export function LoggedInRedirect({ children, to }: Props) {
  const { user, profile, loading } = useAuth();

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

  if (user && profile) {
    return <Navigate to={to} replace />;
  }

  return <>{children}</>;
}
