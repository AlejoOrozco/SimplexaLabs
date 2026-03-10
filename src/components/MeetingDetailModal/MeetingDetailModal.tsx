import { createPortal } from "react-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Meeting } from "../../types/meeting";
import "./MeetingDetailModal.css";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  meeting: Meeting | null;
};

function formatDateTime(d: Date): string {
  return format(d, "EEEE d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
}

export function MeetingDetailModal({
  isOpen,
  onClose,
  meeting,
}: Props) {
  if (!isOpen) return null;

  const modalContent = (
    <div
      className="meeting-detail-backdrop"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="meeting-detail-title"
    >
      <div
        className="meeting-detail-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <button
          type="button"
          className="meeting-detail-close"
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 id="meeting-detail-title" className="meeting-detail-title">
          {meeting
            ? `Reunión con ${meeting.guestName?.trim() || meeting.guestEmail || "Invitado"}`
            : "Detalle de reunión"}
        </h2>

        {meeting ? (
          <dl className="meeting-detail-list">
            <div className="meeting-detail-row">
              <dt>Correo del invitado</dt>
              <dd>{meeting.guestEmail}</dd>
            </div>
            {meeting.guestPhone && (
              <div className="meeting-detail-row">
                <dt>Teléfono</dt>
                <dd>{meeting.guestPhone}</dd>
              </div>
            )}
            <div className="meeting-detail-row">
              <dt>Fecha y hora</dt>
              <dd>
                {formatDateTime(
                  meeting.scheduledAt instanceof Date
                    ? meeting.scheduledAt
                    : new Date(meeting.scheduledAt)
                )}
              </dd>
            </div>
            <div className="meeting-detail-row">
              <dt>Duración</dt>
              <dd>{meeting.durationMinutes} minutos</dd>
            </div>
            <div className="meeting-detail-row">
              <dt>Estado</dt>
              <dd>
                <span
                  className={`meeting-detail-status meeting-detail-status--${meeting.status}`}
                >
                  {STATUS_LABELS[meeting.status] ?? meeting.status}
                </span>
              </dd>
            </div>
            {meeting.notes && (
              <div className="meeting-detail-row">
                <dt>Notas</dt>
                <dd>{meeting.notes}</dd>
              </div>
            )}
            {meeting.source && (
              <div className="meeting-detail-row">
                <dt>Origen</dt>
                <dd>{meeting.source}</dd>
              </div>
            )}
            <div className="meeting-detail-row meeting-detail-row--muted">
              <dt>Creada</dt>
              <dd>
                {formatDateTime(
                  meeting.createdAt instanceof Date
                    ? meeting.createdAt
                    : new Date(meeting.createdAt)
                )}
              </dd>
            </div>
            <div className="meeting-detail-row meeting-detail-row--muted">
              <dt>Actualizada</dt>
              <dd>
                {formatDateTime(
                  meeting.updatedAt instanceof Date
                    ? meeting.updatedAt
                    : new Date(meeting.updatedAt)
                )}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="meeting-detail-empty">No hay reunión seleccionada.</p>
        )}

        <div className="meeting-detail-actions">
          <button
            type="button"
            className="meeting-detail-btn"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
