import { NavLink } from "react-router-dom";
import {
  Calendar,
  UserPlus,
  CreditCard,
  Settings,
  FileText,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDisplayName } from "../../hooks/useDisplayName";
import "./Sidebar.css";

export function Sidebar() {
  const { profile } = useAuth();
  const displayName = useDisplayName();

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <span className="sidebar__welcome">Bienvenido,</span>
        <span className="sidebar__name">{displayName}</span>
      </div>
      <nav className="sidebar__nav">
        <NavLink
          to="/meetings"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <Calendar className="sidebar__icon" />
          Reuniones
        </NavLink>
        {profile?.role === "admin" && (
          <NavLink
            to="/invitations"
            className={({ isActive }) =>
              `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
            }
          >
            <UserPlus className="sidebar__icon" />
            Crear invitaciones
          </NavLink>
        )}
        <NavLink
          to="/subscription"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <CreditCard className="sidebar__icon" />
          Suscripción
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <Settings className="sidebar__icon" />
          Configuración
        </NavLink>
        <NavLink
          to="/terms"
          className={({ isActive }) =>
            `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
          }
        >
          <FileText className="sidebar__icon" />
          Términos y Políticas
        </NavLink>
      </nav>
    </aside>
  );
}
