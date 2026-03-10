import { useCallback, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { sileo } from "sileo";
import "./ScheduleMeetingModal.css";

const MEETINGS_COLLECTION = "meetings";
const DEFAULT_DURATION = 30;

type SlotInfo = { start: Date; end: Date };

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialSlot: SlotInfo | null;
  onSuccess?: () => void;
};

function formatDateForInput(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatTimeForInput(d: Date): string {
  return d.toTimeString().slice(0, 5);
}

export function ScheduleMeetingModal({
  isOpen,
  onClose,
  initialSlot,
  onSuccess,
}: Props) {
  const { user } = useAuth();
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const resetForm = useCallback(() => {
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
    setScheduledDate("");
    setScheduledTime("");
    setDurationMinutes(DEFAULT_DURATION);
    setNotes("");
    setSubmitting(false);
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  useEffect(() => {
    if (isOpen && initialSlot?.start) {
      setScheduledDate(formatDateForInput(initialSlot.start));
      setScheduledTime(formatTimeForInput(initialSlot.start));
    }
  }, [isOpen, initialSlot]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user?.uid) return;
      setSubmitting(true);
      try {
        const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        await addDoc(collection(db, MEETINGS_COLLECTION), {
          assignedToUserId: user.uid,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim().toLowerCase(),
          guestPhone: guestPhone.trim() || null,
          scheduledAt: Timestamp.fromDate(dateTime),
          durationMinutes: Number(durationMinutes) || DEFAULT_DURATION,
          status: "pending",
          notes: notes.trim() || null,
          source: "admin_calendar",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        sileo.success({ title: "Reunión programada", description: "La reunión se creó correctamente." });
        handleClose();
        onSuccess?.();
      } catch (err) {
        console.error(err);
        sileo.error({ title: "Error", description: "No se pudo crear la reunión." });
      } finally {
        setSubmitting(false);
      }
    },
    [
      user?.uid,
      guestName,
      guestEmail,
      guestPhone,
      scheduledDate,
      scheduledTime,
      durationMinutes,
      notes,
      handleClose,
      onSuccess,
    ]
  );

  if (!isOpen) return null;

  const dateValue = scheduledDate;
  const timeValue = scheduledTime;

  const modalContent = (
    <div
      className="schedule-meeting-backdrop"
      onClick={handleClose}
      onKeyDown={(e) => e.key === "Escape" && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-meeting-title"
    >
      <div
        className="schedule-meeting-modal"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && handleClose()}
      >
        <button
          type="button"
          className="schedule-meeting-close"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 id="schedule-meeting-title" className="schedule-meeting-title">
          Programar reunión
        </h2>
        <p className="schedule-meeting-subtitle">
          La reunión se asignará a tu usuario. Completa los datos del invitado.
        </p>
        <form onSubmit={handleSubmit} className="schedule-meeting-form">
          <label className="schedule-meeting-label">
            Nombre del invitado
            <input
              type="text"
              className="schedule-meeting-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              placeholder="Nombre completo"
            />
          </label>
          <label className="schedule-meeting-label">
            Correo del invitado
            <input
              type="email"
              className="schedule-meeting-input"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              placeholder="correo@ejemplo.com"
            />
          </label>
          <label className="schedule-meeting-label">
            Teléfono <span className="schedule-meeting-optional">(opcional)</span>
            <input
              type="tel"
              className="schedule-meeting-input"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+52 123 456 7890"
            />
          </label>
          <div className="schedule-meeting-row">
            <label className="schedule-meeting-label">
              Fecha
              <input
                type="date"
                className="schedule-meeting-input"
                value={dateValue}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </label>
            <label className="schedule-meeting-label">
              Hora
              <input
                type="time"
                className="schedule-meeting-input"
                value={timeValue}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="schedule-meeting-label">
            Duración (minutos)
            <select
              className="schedule-meeting-input"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
            >
              <option value={15}>15</option>
              <option value={30}>30</option>
              <option value={45}>45</option>
              <option value={60}>60</option>
            </select>
          </label>
          <label className="schedule-meeting-label">
            Notas <span className="schedule-meeting-optional">(opcional)</span>
            <textarea
              className="schedule-meeting-input schedule-meeting-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Notas internas..."
            />
          </label>
          <div className="schedule-meeting-actions">
            <button
              type="button"
              className="schedule-meeting-btn schedule-meeting-btn--secondary"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="schedule-meeting-btn schedule-meeting-btn--primary"
              disabled={submitting}
            >
              {submitting ? "Guardando…" : "Programar reunión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
