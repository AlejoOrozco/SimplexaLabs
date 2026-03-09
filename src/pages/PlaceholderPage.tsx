import { useLocation } from 'react-router-dom';
import { PageLayout } from '../components/PageLayout';
import './PlaceholderPage.css';

const PLACEHOLDERS: Record<string, string> = {
  subscription: 'Suscripción',
  settings: 'Configuración',
  terms: 'Términos y Políticas',
};

export function PlaceholderPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, '') || 'subscription';
  const title = PLACEHOLDERS[slug] ?? 'Página';

  return (
    <PageLayout title={title}>
      <p className="placeholder-page__text">Próximamente.</p>
    </PageLayout>
  );
}
