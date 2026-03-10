import type { Meeting } from "../../types/meeting";
import { MeetingListItem } from "../MeetingListItem";
import "./MeetingsList.css";

type Props = {
  meetings: Meeting[];
  onSelectMeeting?: (meeting: Meeting) => void;
};

export function MeetingsList({ meetings, onSelectMeeting }: Props) {
  const sorted = [...meetings].sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );

  if (sorted.length === 0) {
    return (
      <div className="meetings-list meetings-list--empty">
        <p className="meetings-list__empty-text">No hay reuniones programadas.</p>
      </div>
    );
  }

  return (
    <ul className="meetings-list" role="list">
      {sorted.map((meeting) => (
        <li key={meeting.id}>
          <button
            type="button"
            className="meetings-list__item-btn"
            onClick={() => onSelectMeeting?.(meeting)}
          >
            <MeetingListItem meeting={meeting} />
          </button>
        </li>
      ))}
    </ul>
  );
}
