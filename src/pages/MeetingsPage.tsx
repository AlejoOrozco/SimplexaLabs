import { useAuth } from '../hooks/useAuth';
import { useMeetings } from '../hooks/useMeetings';
import { MeetingListItem } from '../components/MeetingListItem';
import { PageLayout } from '../components/PageLayout';
import './MeetingsPage.css';

export function MeetingsPage() {
  const { user } = useAuth();
  const { meetings, loading, error } = useMeetings(user?.uid);

  return (
    <PageLayout
      title="Reuniones programadas"
      subtitle="Todas las reuniones asignadas a ti"
    >
      {loading ? (
        <p className="meetings-page__empty">Cargando…</p>
      ) : error ? (
        <div className="meetings-page__error">
          <p>No se pudieron cargar las reuniones.</p>
          <p className="meetings-page__error-detail">
            {error instanceof Error ? error.message : String(error)}
          </p>
          <p className="meetings-page__error-hint">
            Verifica las reglas de Firestore para la colección &quot;meetings&quot; y que el documento tenga assignedToUserId igual a tu UID.
          </p>
        </div>
      ) : meetings.length === 0 ? (
        <p className="meetings-page__empty">Aún no tienes reuniones programadas.</p>
      ) : (
        <ul className="meetings-page__list">
          {meetings.map((m) => (
            <MeetingListItem key={m.id} meeting={m} />
          ))}
        </ul>
      )}
    </PageLayout>
  );
}
