import { useMemo, useCallback, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isToday,
  isSameMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import { es } from "date-fns/locale";
import type { Meeting } from "../../types/meeting";
import "./MeetingsCalendar.css";

const WEEK_STARTS_ON = 1; // Monday
const DAY_HEADERS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

export type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  meeting: Meeting;
};

type SlotInfo = { start: Date; end: Date };

type Props = {
  meetings: Meeting[];
  isAdmin: boolean;
  onSelectSlot?: (slot: SlotInfo) => void;
  onSelectEvent?: (event: CalendarEvent) => void;
};

function meetingToEvent(m: Meeting): CalendarEvent {
  const start = new Date(m.scheduledAt);
  const end = new Date(start.getTime() + m.durationMinutes * 60 * 1000);
  const guestLabel = m.guestName?.trim() || m.guestEmail || "Invitado";
  return {
    id: m.id,
    title: `Reunión con ${guestLabel}`,
    start,
    end,
    meeting: m,
  };
}

function getMeetingsForDay(meetings: Meeting[], day: Date): Meeting[] {
  const dayStart = startOfDay(day);
  const dayEnd = endOfDay(day);
  return meetings.filter((m) => {
    const t = new Date(m.scheduledAt).getTime();
    return t >= dayStart.getTime() && t <= dayEnd.getTime();
  });
}

export function MeetingsCalendar({
  meetings,
  isAdmin,
  onSelectSlot,
  onSelectEvent,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const grid = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentMonth), {
      weekStartsOn: WEEK_STARTS_ON,
    });
    const end = endOfWeek(endOfMonth(currentMonth), {
      weekStartsOn: WEEK_STARTS_ON,
    });
    const days = eachDayOfInterval({ start, end });
    const rows: Date[][] = [];
    for (let i = 0; i < days.length; i += 7) rows.push(days.slice(i, i + 7));
    return rows;
  }, [currentMonth]);

  const goPrev = useCallback(() => {
    setCurrentMonth((d) => subMonths(d, 1));
  }, []);

  const goNext = useCallback(() => {
    setCurrentMonth((d) => addMonths(d, 1));
  }, []);

  const goToday = useCallback(() => {
    setCurrentMonth(new Date());
  }, []);

  const handleDayClick = useCallback(
    (day: Date) => {
      if (!isAdmin || !onSelectSlot) return;
      onSelectSlot({
        start: startOfDay(day),
        end: endOfDay(day),
      });
    },
    [isAdmin, onSelectSlot]
  );

  const handleEventClick = useCallback(
    (e: React.MouseEvent, meeting: Meeting) => {
      e.stopPropagation();
      const ev = meetingToEvent(meeting);
      onSelectEvent?.(ev);
    },
    [onSelectEvent]
  );

  const monthTitle = format(currentMonth, "MMMM yyyy", { locale: es });

  return (
    <div
      className={`meetings-calendar ${isAdmin ? "meetings-calendar--selectable" : ""}`}
      role="application"
      aria-label="Calendario de reuniones"
    >
      <header className="meetings-calendar__toolbar">
        <div className="meetings-calendar__nav">
          <button
            type="button"
            className="meetings-calendar__btn"
            onClick={goToday}
            aria-label="Ir a hoy"
          >
            Hoy
          </button>
          <button
            type="button"
            className="meetings-calendar__btn"
            onClick={goPrev}
            aria-label="Mes anterior"
          >
            Anterior
          </button>
          <button
            type="button"
            className="meetings-calendar__btn"
            onClick={goNext}
            aria-label="Mes siguiente"
          >
            Siguiente
          </button>
        </div>
        <h2 className="meetings-calendar__title">
          {monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1)}
        </h2>
      </header>

      <div className="meetings-calendar__grid-wrap">
        <div className="meetings-calendar__headers" role="row">
          {DAY_HEADERS.map((label) => (
            <div key={label} className="meetings-calendar__header" role="columnheader">
              {label}
            </div>
          ))}
        </div>

        <div className="meetings-calendar__body">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="meetings-calendar__row" role="row">
              {row.map((day) => {
                const inMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);
                const dayMeetings = getMeetingsForDay(meetings, day);
                const canSelect = isAdmin && !!onSelectSlot;

                return (
                  <div
                    key={day.getTime()}
                    className={[
                      "meetings-calendar__cell",
                      !inMonth && "meetings-calendar__cell--off",
                      today && "meetings-calendar__cell--today",
                      canSelect && "meetings-calendar__cell--selectable",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    role="gridcell"
                    aria-selected={false}
                    onClick={() => canSelect && handleDayClick(day)}
                  >
                    <span className="meetings-calendar__day-num">
                      {format(day, "d")}
                    </span>
                    <div className="meetings-calendar__events">
                      {dayMeetings.slice(0, 3).map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          className="meetings-calendar__event"
                          onClick={(e) => handleEventClick(e, m)}
                        >
                          Reunión con {m.guestName?.trim() || m.guestEmail || "Invitado"}
                        </button>
                      ))}
                      {dayMeetings.length > 3 && (
                        <span className="meetings-calendar__more">
                          +{dayMeetings.length - 3} más
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
