import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Settings, CreditCard, FileText, LogOut, Calendar, UserPlus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useAuth } from "../../hooks/useAuth";
import { useDisplayName } from "../../hooks/useDisplayName";
import "./ProfileDropdown.css";

interface MenuItem {
  label: string;
  value?: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, profile, signOut } = useAuth();
  const displayName = useDisplayName();

  const menuItems: MenuItem[] = [
    { label: "Reuniones", href: "/meetings", icon: <Calendar className="profile-dropdown-icon" /> },
    ...(profile?.role === "admin"
      ? [{ label: "Crear invitaciones" as const, href: "/invitations" as const, icon: <UserPlus className="profile-dropdown-icon" /> }]
      : []),
    {
      label: "Suscripción",
      value: profile?.plan ? String(profile.plan).toUpperCase() : undefined,
      href: "/subscription",
      icon: <CreditCard className="profile-dropdown-icon" />,
    },
    { label: "Configuración", href: "/settings", icon: <Settings className="profile-dropdown-icon" /> },
    {
      label: "Términos y Políticas",
      href: "/terms",
      icon: <FileText className="profile-dropdown-icon" />,
    },
  ];

  const avatarUrl = user?.photoURL ?? null;

  return (
    <div className="profile-dropdown">
      <DropdownMenu onOpenChange={setIsOpen}>
        <div className="profile-dropdown__group">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="profile-dropdown__trigger"
            >
              <div className="profile-dropdown__info">
                <div className="profile-dropdown__name">{displayName}</div>
                <div className="profile-dropdown__email">{user?.email}</div>
              </div>
              <div className="profile-dropdown__avatar-wrap">
                <div className="profile-dropdown__avatar">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="profile-dropdown__avatar-img"
                    />
                  ) : (
                    <span className="profile-dropdown__avatar-initial">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </DropdownMenuTrigger>

          <div
            className={cn(
              "profile-dropdown__indicator",
              isOpen && "profile-dropdown__indicator--open"
            )}
            aria-hidden
          >
            <svg width="12" height="24" viewBox="0 0 12 24" fill="none">
              <path
                d="M2 4C6 8 6 16 2 20"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <DropdownMenuContent align="end" sideOffset={8} className="profile-dropdown__content">
            <div className="profile-dropdown__menu">
              {menuItems.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="profile-dropdown__item"
                    >
                      {item.icon}
                      <span className="profile-dropdown__item-label">{item.label}</span>
                      {item.value && (
                        <span className="profile-dropdown__item-value">{item.value}</span>
                      )}
                    </a>
                  ) : (
                    <Link
                      to={item.href}
                      className="profile-dropdown__item"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.icon}
                      <span className="profile-dropdown__item-label">{item.label}</span>
                      {item.value && (
                        <span className="profile-dropdown__item-value">{item.value}</span>
                      )}
                    </Link>
                  )}
                </DropdownMenuItem>
              ))}
            </div>

            <DropdownMenuSeparator className="profile-dropdown__separator" />

            <DropdownMenuItem asChild>
              <button
                type="button"
                className="profile-dropdown__signout"
                onClick={() => {
                  void signOut();
                  setIsOpen(false);
                }}
              >
                <LogOut className="profile-dropdown-icon profile-dropdown-icon--red" />
                <span>Cerrar sesión</span>
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  );
}
