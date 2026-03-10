import { useState, useCallback, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useMeetings } from "../hooks/useMeetings";
import { useIsMobile } from "../hooks/useMediaQuery";
import { MeetingsCalendar } from "../components/MeetingsCalendar";
import { MeetingsList } from "../components/MeetingsList";
import { ScheduleMeetingModal } from "../components/ScheduleMeetingModal";
import { MeetingDetailModal } from "../components/MeetingDetailModal";
import { PageLayout } from "../components/PageLayout";
import type { Meeting } from "../types/meeting";
import "./MeetingsPage.css";

const VIEW_STORAGE_KEY = "meetings-view-preference";
type ViewMode = "list" | "calendar";

type SlotInfo = { start: Date; end: Date };

function getInitialView(isMobile: boolean): ViewMode {
  try {
    const stored = localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "list" || stored === "calendar") return stored;
  } catch {
    /* ignore */
  }
  return isMobile ? "list" : "calendar";
}

export function MeetingsPage() {
  const { user, profile } = useAuth();
  const isMobile = useIsMobile();
  const [refreshKey, setRefreshKey] = useState(0);
  const { meetings, loading, error } = useMeetings(user?.uid, { refreshKey });
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const [viewMode, setViewMode] = useState<ViewMode>(() => getInitialView(isMobile));

  useEffect(() => {
    setViewMode(getInitialView(isMobile));
  }, [isMobile]);

  const handleViewChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {
      /* ignore */
    }
  }, []);

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
        <>
          <div className="meetings-page__view-toggle" role="tablist" aria-label="Vista de reuniones">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "list"}
              className={`meetings-page__toggle-btn ${viewMode === "list" ? "meetings-page__toggle-btn--active" : ""}`}
              onClick={() => handleViewChange("list")}
            >
              Lista
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "calendar"}
              className={`meetings-page__toggle-btn ${viewMode === "calendar" ? "meetings-page__toggle-btn--active" : ""}`}
              onClick={() => handleViewChange("calendar")}
            >
              Calendario
            </button>
          </div>

          {viewMode === "list" ? (
            <div className="meetings-page__list-wrap">
              <MeetingsList
                meetings={meetings}
                onSelectMeeting={(m) => {
                  setSelectedMeeting(m);
                  setDetailModalOpen(true);
                }}
              />
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
        </>
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
