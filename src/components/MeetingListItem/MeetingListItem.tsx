import { formatMeetingDate } from "../../lib/formatMeetingDate";
import type { Meeting } from "../../types/meeting";
import "./MeetingListItem.css";

const STATUS_LABELS: Record<Meeting["status"], string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
  completed: "Completada",
};

type Props = { meeting: Meeting; className?: string };

export function MeetingListItem({ meeting, className = "" }: Props) {
  const { scheduledAt, guestName, guestEmail, status } = meeting;
  return (
    <li className={`meeting-list-item ${className}`.trim()}>
      <span className="meeting-list-item__date">
        {formatMeetingDate(scheduledAt)}
      </span>
      <span className="meeting-list-item__guest">
        {guestName} · {guestEmail}
      </span>
      <span
        className={`meeting-list-item__status meeting-list-item__status--${status}`}
      >
        {STATUS_LABELS[status]}
      </span>
    </li>
  );
}
