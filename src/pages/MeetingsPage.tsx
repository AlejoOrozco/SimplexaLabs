import { useState, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMeetings } from "../hooks/useMeetings";
import { MeetingsCalendar } from "../components/MeetingsCalendar";
import { ScheduleMeetingModal } from "../components/ScheduleMeetingModal";
import { MeetingDetailModal } from "../components/MeetingDetailModal";
import { PageLayout } from "../components/PageLayout";
import type { Meeting } from "../types/meeting";

type SlotInfo = { start: Date; end: Date };

export function MeetingsPage() {
  const { user, profile } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const { meetings, loading, error } = useMeetings(user?.uid, { refreshKey });
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const isAdmin = profile?.role === "admin";

  const handleSelectSlot = useCallback((slot: SlotInfo) => {
    setSelectedSlot(slot);
    setScheduleModalOpen(true);
  }, []);

  const handleSelectEvent = useCallback((event: { meeting: Meeting }) => {
    setSelectedMeeting(event.meeting);
    setDetailModalOpen(true);
  }, []);

  const handleCloseDetailModal = useCallback(() => {
    setDetailModalOpen(false);
    setSelectedMeeting(null);
  }, []);

  const handleCloseScheduleModal = useCallback(() => {
    setScheduleModalOpen(false);
    setSelectedSlot(null);
  }, []);

  const handleScheduleSuccess = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return (
    <PageLayout
      wide
      title="Reuniones programadas"
      subtitle={
        isAdmin
          ? "Todas las reuniones asignadas a ti. Haz clic en un día para programar una nueva (solo administradores)."
          : "Todas las reuniones asignadas a ti"
      }
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
      ) : (
        <div className={`meetings-calendar-wrap ${isAdmin ? "meetings-calendar-wrap--selectable" : ""}`}>
          <MeetingsCalendar
            meetings={meetings}
            isAdmin={isAdmin}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />
        </div>
      )}

      <ScheduleMeetingModal
        isOpen={scheduleModalOpen}
        onClose={handleCloseScheduleModal}
        initialSlot={selectedSlot}
        onSuccess={handleScheduleSuccess}
      />

      <MeetingDetailModal
        isOpen={detailModalOpen}
        onClose={handleCloseDetailModal}
        meeting={selectedMeeting}
      />
    </PageLayout>
  );
}
