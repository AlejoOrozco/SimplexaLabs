import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
  query,
  where,
  getDocs,
  limit,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sileo } from 'sileo';
import './BookDemoPage.css';

const MEETINGS_COLLECTION = 'meetings';
const USERS_COLLECTION = 'users';

export function BookDemoPage() {
  const { user } = useAuth();
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
        let assignedToUserId = user?.uid ?? null;
        if (!assignedToUserId) {
          const adminQuery = query(
            collection(db, USERS_COLLECTION),
            where('role', '==', 'admin'),
            limit(1)
          );
          const adminSnap = await getDocs(adminQuery);
          assignedToUserId = adminSnap.docs[0]?.id ?? null;
        }
        if (!assignedToUserId) {
          sileo.error({ title: 'Error', description: 'No hay administrador configurado. Contacta soporte.' });
          setSubmitting(false);
          return;
        }
        const dateTime = new Date(`${scheduledDate}T${scheduledTime}`);
        await addDoc(collection(db, MEETINGS_COLLECTION), {
          assignedToUserId: assignedToUserId as string,
          guestName: guestName.trim(),
          guestEmail: guestEmail.trim().toLowerCase(),
          guestPhone: guestPhone.trim() || null,
          scheduledAt: Timestamp.fromDate(dateTime),
          durationMinutes: 30,
          status: 'pending',
          notes: notes.trim() || null,
          source: 'website',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        sileo.success({ title: 'Demo reservado', description: 'Te contactaremos pronto.' });
        setGuestName('');
        setGuestEmail('');
        setGuestPhone('');
        setScheduledDate('');
        setScheduledTime('');
        setNotes('');
      } catch (err) {
        console.error(err);
        sileo.error({ title: 'Error', description: 'No se pudo reservar la demo.' });
      } finally {
        setSubmitting(false);
      }
    },
    [user?.uid, guestName, guestEmail, guestPhone, scheduledDate, scheduledTime, notes]
  );

  return (
    <div className="book-demo-page">
      <main className="book-demo-main">
        <h1 className="book-demo-title">Reservar demo</h1>
        <p className="book-demo-subtitle">
          Completa el formulario y te contactaremos para agendar tu demo.
        </p>
        <form onSubmit={handleSubmit} className="book-demo-form">
          <label className="book-demo-label">
            Nombre
            <input
              type="text"
              className="book-demo-input"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              placeholder="Tu nombre"
            />
          </label>
          <label className="book-demo-label">
            Correo electrónico
            <input
              type="email"
              className="book-demo-input"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
            />
          </label>
          <label className="book-demo-label">
            Teléfono <span className="book-demo-optional">(opcional)</span>
            <input
              type="tel"
              className="book-demo-input"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              placeholder="+52 123 456 7890"
            />
          </label>
          <div className="book-demo-row">
            <label className="book-demo-label">
              Fecha preferida
              <input
                type="date"
                className="book-demo-input"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </label>
            <label className="book-demo-label">
              Hora preferida
              <input
                type="time"
                className="book-demo-input"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </label>
          </div>
          <label className="book-demo-label">
            Notas <span className="book-demo-optional">(opcional)</span>
            <textarea
              className="book-demo-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Cuéntanos sobre tu negocio o necesidades..."
            />
          </label>
          <button
            type="submit"
            className="book-demo-submit"
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Reservar demo'}
          </button>
        </form>
      </main>
    </div>
  );
}
