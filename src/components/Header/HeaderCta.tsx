import { Link } from "react-router-dom";
import { CtaBorderWrap } from "../CtaBorderWrap";
import { AuthModal } from "../AuthModal";
import { ProfileDropdown } from "../ProfileDropdown";
import { useAuth } from "../../hooks/useAuth";

type Props = {
  onAuthModalOpen: () => void;
  authModalOpen: boolean;
  onAuthModalClose: () => void;
};

export function HeaderCta({
  onAuthModalOpen,
  authModalOpen,
  onAuthModalClose,
}: Props) {
  const { user, loading } = useAuth();

  return (
    <>
      <span className="header__cta-wrap header__cta-wrap--gap">
        {!loading && (
          <>
            {user ? (
              <ProfileDropdown />
            ) : (
              <button
                type="button"
                className="header__login-link"
                onClick={onAuthModalOpen}
              >
                Iniciar sesión
              </button>
            )}
          </>
        )}
        {!user && (
          <CtaBorderWrap>
            <Link to="/book-demo" className="header__cta cta-gradient-fill">
              Reservar Demo
            </Link>
          </CtaBorderWrap>
        )}
      </span>
      <AuthModal isOpen={authModalOpen} onClose={onAuthModalClose} />
    </>
  );
}
