import { Link } from "react-router-dom";

type Props = {
  title: string;
  titleRef: React.RefObject<HTMLHeadingElement | null>;
};

export function HeaderLogo({ title, titleRef }: Props) {
  return (
    <Link to="/" className="header__title-link">
      <h1 ref={titleRef} className="header__title">
        {title}
      </h1>
    </Link>
  );
}
