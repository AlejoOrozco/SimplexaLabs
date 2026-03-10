import { Link } from "react-router-dom";
import { useIsMobile } from "../../hooks/useMediaQuery";

type Props = {
  title: string;
  initials?: string;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
};

export function HeaderLogo({ title, initials = "SLL", titleRef }: Props) {
  const isMobile = useIsMobile();
  const displayText = isMobile ? initials : title;
  return (
    <Link to="/" className="header__title-link">
      <h1 ref={titleRef} className="header__title">
        {displayText}
      </h1>
    </Link>
  );
}
