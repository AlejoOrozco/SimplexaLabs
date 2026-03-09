import { useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useScrollLinkedTitle } from "../../hooks/useScrollLinkedTitle";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderCta } from "./HeaderCta";
import "./Header.css";

const HERO_SECTION_ID = "section-hero";

export function Header() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useScrollLinkedTitle(isHome ? HERO_SECTION_ID : "", titleRef, innerRef);

  return (
    <header className="header">
      <div className="header__bar">
        <div ref={innerRef} className="header__inner">
          <HeaderLogo title="SimpLexaLabs" titleRef={titleRef} />
          <HeaderCta
            onAuthModalOpen={() => setAuthModalOpen(true)}
            authModalOpen={authModalOpen}
            onAuthModalClose={() => setAuthModalOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
