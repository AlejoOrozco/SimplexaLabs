import { useRef } from 'react';
import { useScrollLinkedTitle } from '../../hooks/useScrollLinkedTitle';
import { CtaBorderWrap } from '../CtaBorderWrap';
import './Header.css';

const HERO_SECTION_ID = 'section-hero';

export function Header() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  useScrollLinkedTitle(HERO_SECTION_ID, titleRef, innerRef);

  return (
    <header className="header">
      <div className="header__bar">
        <div ref={innerRef} className="header__inner">
          <h1 ref={titleRef} className="header__title">
            SimpLexaLabs
          </h1>
          <span className="header__cta-wrap">
            <CtaBorderWrap>
              <a href="#demo" className="header__cta cta-gradient-fill">
                Reservar Demo
              </a>
            </CtaBorderWrap>
          </span>
        </div>
      </div>
    </header>
  );
}
