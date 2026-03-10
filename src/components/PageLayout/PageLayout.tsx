import "./PageLayout.css";

type Props = {
  title?: string;
  subtitle?: string;
  narrow?: boolean;
  wide?: boolean;
  children: React.ReactNode;
};

/**
 * Shared layout for dashboard pages. Keeps padding, max-width, and spacing
 * consistent so content doesn’t look different from one page to another.
 */
export function PageLayout({ title, subtitle, narrow, wide, children }: Props) {
  return (
    <div
      className={[
        "page-layout",
        narrow && "page-layout--narrow",
        wide && "page-layout--wide",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {(title ?? subtitle) && (
        <header className="page-layout__header">
          {title && <h1 className="page-layout__title">{title}</h1>}
          {subtitle && (
            <p className="page-layout__subtitle">{subtitle}</p>
          )}
        </header>
      )}
      <div className="page-layout__content">{children}</div>
    </div>
  );
}
