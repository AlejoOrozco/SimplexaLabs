import { useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { sileo } from 'sileo';
import { PageLayout } from '../components/PageLayout';
import './InvitationsPage.css';

const INVITES_COLLECTION = 'invites';

export function InvitationsPage() {
  const { user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState('free');
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!user || !profile) return;
      if (profile.role !== 'admin') return;
      setSubmitting(true);
      try {
        await addDoc(collection(db, INVITES_COLLECTION), {
          email: email.trim().toLowerCase(),
          plan,
          role,
          invitedBy: user.uid,
          status: 'pending',
          createdAt: serverTimestamp(),
        });
        sileo.success({ title: 'Invitación creada', description: `${email} podrá registrarse.` });
        setEmail('');
      } catch (err) {
        console.error(err);
        sileo.error({ title: 'Error', description: 'No se pudo crear la invitación.' });
      } finally {
        setSubmitting(false);
      }
    },
    [user, profile, email, plan, role]
  );

  if (loading) {
    return (
      <PageLayout title="Cargando…">
        <p className="invitations-loading-text">Cargando...</p>
      </PageLayout>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile?.role !== 'admin') {
    return (
      <PageLayout title="Sin permiso">
        <p className="invitations-forbidden-text">
          No tienes permiso para crear invitaciones.
        </p>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Crear invitación"
      subtitle="Añade el correo de la persona que quieres invitar. Podrá iniciar sesión con Google usando ese correo."
      narrow
    >
      <form onSubmit={handleSubmit} className="invitations-form">
          <label className="invitations-label">
            Correo electrónico
            <input
              type="email"
              className="invitations-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@empresa.com"
            />
          </label>
          <label className="invitations-label">
            Plan
            <select
              className="invitations-select"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="free">Free</option>
              <option value="basic">Basic</option>
              <option value="pro">Pro</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </label>
          <label className="invitations-label">
            Rol
            <select
              className="invitations-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">Usuario</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button
            type="submit"
            className="invitations-submit"
            disabled={submitting}
          >
            {submitting ? 'Guardando...' : 'Crear invitación'}
          </button>
        </form>
    </PageLayout>
  );
}
