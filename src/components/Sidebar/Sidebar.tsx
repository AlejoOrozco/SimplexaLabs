import { NavLink } from "react-router-dom";
import {
  Calendar,
  UserPlus,
  CreditCard,
  Settings,
  FileText,
  Menu,
  PanelLeftClose,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useDisplayName } from "../../hooks/useDisplayName";
import "./Sidebar.css";

type Props = {
  isMobile: boolean;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
};

const navItems: Array<{
  to: string;
  icon: typeof Calendar;
  label: string;
  adminOnly?: boolean;
}> = [
  { to: "/meetings", icon: Calendar, label: "Reuniones" },
  { to: "/invitations", icon: UserPlus, label: "Crear invitaciones", adminOnly: true },
  { to: "/subscription", icon: CreditCard, label: "Suscripción" },
  { to: "/settings", icon: Settings, label: "Configuración" },
  { to: "/terms", icon: FileText, label: "Términos y Políticas" },
];

export function Sidebar({ isMobile, expanded, onExpand, onCollapse }: Props) {
  const { profile } = useAuth();
  const displayName = useDisplayName();
  const isAdmin = profile?.role === "admin";

  const filteredItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {isMobile && expanded && (
        <button
          type="button"
          className="sidebar__backdrop"
          onClick={onCollapse}
          aria-label="Cerrar menú"
        />
      )}
      <aside
        className={`sidebar ${isMobile ? "sidebar--mobile" : ""} ${isMobile && !expanded ? "sidebar--collapsed" : ""} ${isMobile && expanded ? "sidebar--expanded" : ""}`}
      >
        {isMobile && (
          <div className="sidebar__toggle-row">
            {expanded ? (
              <button
                type="button"
                className="sidebar__toggle-btn"
                onClick={onCollapse}
                aria-label="Cerrar menú"
              >
                <PanelLeftClose className="sidebar__icon" />
              </button>
            ) : (
              <button
                type="button"
                className="sidebar__toggle-btn"
                onClick={onExpand}
                aria-label="Abrir menú"
              >
                <Menu className="sidebar__icon" />
              </button>
            )}
          </div>
        )}
        {(!isMobile || expanded) && (
          <div className="sidebar__header">
            <span className="sidebar__welcome">Bienvenido,</span>
            <span className="sidebar__name">{displayName}</span>
          </div>
        )}
        <nav className="sidebar__nav">
          {filteredItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? "sidebar__link--active" : ""}`
              }
              onClick={() => isMobile && expanded && onCollapse()}
              title={isMobile && !expanded ? label : undefined}
            >
              <Icon className="sidebar__icon" />
              {(!isMobile || expanded) && <span className="sidebar__link-label">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
