import { useEffect, useState } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../lib/firebase";
import type { Meeting } from "../types/meeting";

const MEETINGS_COLLECTION = "meetings";
const DEFAULT_LIMIT = 50;

/**
 * Loads meetings from Firestore for the current user (uid).
 * Uses assignedToUserId to find meetings assigned to this user.
 * No data is fetched from Auth — only from Firestore, keyed by uid.
 *
 */
export function useMeetings(uid: string | undefined, options?: { limitCount?: number }) {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(!!uid);
  const [error, setError] = useState<Error | null>(null);

  const limitCount = options?.limitCount ?? DEFAULT_LIMIT;

  useEffect(() => {
    if (!uid) return;

    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
    });

    const q = query(
      collection(db, MEETINGS_COLLECTION),
      where("assignedToUserId", "==", uid),
      limit(limitCount)
    );

    getDocs(q)
      .then((snap) => {
        if (cancelled) return;
        const list: Meeting[] = snap.docs
          .map((d) => {
          const data = d.data();
          const scheduledAt = data.scheduledAt?.toDate?.();
          const createdAt = data.createdAt?.toDate?.();
          const updatedAt = data.updatedAt?.toDate?.();
          return {
            id: d.id,
            assignedToUserId: data.assignedToUserId,
            guestName: data.guestName ?? "",
            guestEmail: data.guestEmail ?? "",
            guestPhone: data.guestPhone,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : new Date(0),
            durationMinutes: data.durationMinutes ?? data.duration ?? 30,
            status: data.status ?? "pending",
            notes: data.notes,
            source: data.source,
            createdAt: createdAt ? new Date(createdAt) : new Date(0),
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(0),
          };
        })
          .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
        setMeetings(list);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[useMeetings] Firestore error for uid:", uid, err);
        if (err && typeof err === "object" && "code" in err) {
          console.error("[useMeetings] Error code:", (err as { code?: string }).code);
        }
        setError(err instanceof Error ? err : new Error(String(err)));
        setMeetings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [uid, limitCount]);

  if (!uid) {
    return { meetings: [], loading: false, error: null };
  }
  return { meetings, loading, error };
}
