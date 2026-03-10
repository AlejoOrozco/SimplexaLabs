import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import type { UserProfile, Plan, UserRole } from "../types/user";

const USERS_COLLECTION = "users";
const INVITES_COLLECTION = "invites";

function authErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/email-already-in-use":
      "Este correo ya está registrado. Inicia sesión o usa otro.",
    "auth/invalid-email": "Correo electrónico no válido.",
    "auth/operation-not-allowed": "Operación no permitida. Contacta soporte.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/user-disabled": "Esta cuenta ha sido deshabilitada.",
    "auth/user-not-found": "No hay cuenta con este correo.",
    "auth/wrong-password": "Contraseña incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Espera un momento.",
    "auth/popup-closed-by-user": "Inicio de sesión cancelado.",
    "auth/cancelled-popup-request": "Inicio de sesión cancelado.",
    "auth/popup-blocked": "El navegador bloqueó la ventana. Permite ventanas emergentes e intenta de nuevo.",
    "auth/account-exists-with-different-credential":
      "Este correo ya está registrado con otro método. Usa ese método o inicia sesión con Google.",
  };
  return messages[code] ?? "Ha ocurrido un error. Intenta de nuevo.";
}

function parseDisplayName(displayName: string | null): { name: string; lastName: string } {
  if (!displayName?.trim()) return { name: "", lastName: "" };
  const parts = displayName.trim().split(/\s+/);
  if (parts.length === 1) return { name: parts[0], lastName: "" };
  return {
    name: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

type AuthState = {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
};

type AuthContextValue = AuthState & {
  signInWithGoogle: () => Promise<void>;
  signUp: (params: {
    email: string;
    password: string;
    name: string;
    lastName: string;
    companyName?: string;
  }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const createUserFromInvite = useCallback(
    async (uid: string, email: string, inviteData: { plan: string; role: string; name?: string; lastName?: string }) => {
      const { name, lastName } = inviteData;
      await setDoc(doc(db, USERS_COLLECTION, uid), {
        name: name ?? "Usuario",
        lastName: lastName ?? "",
        email,
        plan: inviteData.plan ?? "free",
        role: inviteData.role ?? "user",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        socialMedias: [],
      });
    },
    []
  );

  const findPendingInvite = useCallback(async (email: string) => {
    const q = query(
      collection(db, INVITES_COLLECTION),
      where("email", "==", email),
      where("status", "==", "pending")
    );
    const snap = await getDocs(q);
    return snap.docs[0] ?? null;
  }, []);

  const loadProfile = useCallback(
    (data: Record<string, unknown>): UserProfile => {
      const rawLastName = data.lastName ?? data.lastname;
      return {
        name: String(data.name ?? ""),
        lastName: typeof rawLastName === "string" ? rawLastName : "",
        email: String(data.email ?? ""),
        companyName: typeof data.companyName === "string" ? data.companyName : undefined,
        plan: (data.plan as Plan) ?? "free",
        role: (data.role as UserRole) ?? "user",
        createdAt: (data.createdAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
        updatedAt: (data.updatedAt as { toDate?: () => Date })?.toDate?.() ?? new Date(),
        socialMedias: Array.isArray(data.socialMedias) ? (data.socialMedias as UserProfile["socialMedias"]) : [],
      };
    },
    []
  );

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const newUser = result.user;
      const email = newUser.email ?? "";
      const userRef = doc(db, USERS_COLLECTION, newUser.uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        return;
      }
      const inviteDoc = await findPendingInvite(email);
      if (inviteDoc) {
        const invite = inviteDoc.data();
        const { name, lastName } = parseDisplayName(newUser.displayName);
        await createUserFromInvite(newUser.uid, email, {
          plan: (invite.plan as string) ?? "free",
          role: (invite.role as string) ?? "user",
          name: name || undefined,
          lastName: lastName || undefined,
        });
        await updateDoc(doc(db, INVITES_COLLECTION, inviteDoc.id), {
          status: "accepted",
          updatedAt: serverTimestamp(),
        });
        const newSnap = await getDoc(userRef);
        if (newSnap.exists()) {
          setProfile(loadProfile(newSnap.data()));
        }
      } else {
        await deleteUser(newUser);
        const message =
          "No tienes acceso. Si fuiste invitado, usa el correo correcto. Si no, contacta al administrador.";
        const unauthorizedError = Object.assign(new Error(message), {
          code: "auth/not-recognized" as const,
        });
        setError(message);
        throw unauthorizedError;
      }
    } catch (err) {
      const message =
        err && typeof err === "object" && "code" in err
          ? authErrorMessage((err as { code: string }).code)
          : "No se pudo iniciar sesión con Google. Intenta de nuevo.";
      setError(message);
      throw err;
    }
  }, [findPendingInvite, createUserFromInvite, loadProfile]);

  const signUp = useCallback(
    async (params: {
      email: string;
      password: string;
      name: string;
      lastName: string;
      companyName?: string;
    }) => {
      setError(null);
      const { email, password, name, lastName, companyName } = params;
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const newUser = userCredential.user;

        await setDoc(doc(db, USERS_COLLECTION, newUser.uid), {
          name,
          lastName,
          email: newUser.email ?? email,
          ...(companyName ? { companyName } : {}),
          plan: "free",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          socialMedias: [],
        });
      } catch (err) {
        const message =
          err && typeof err === "object" && "code" in err
            ? authErrorMessage((err as { code: string }).code)
            : "No se pudo crear la cuenta. Intenta de nuevo.";
        setError(message);
        throw err;
      }
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const message =
        err && typeof err === "object" && "code" in err
          ? authErrorMessage((err as { code: string }).code)
          : "No se pudo iniciar sesión. Intenta de nuevo.";
      setError(message);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    // Full page redirect so all in-memory state (React, any caches) is cleared.
    // Avoids any stale user/profile data being reused.
    window.location.replace("/");
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setProfile(null);
        setLoading(false);
        return;
      }
      try {
        const userRef = doc(db, USERS_COLLECTION, firebaseUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setProfile(loadProfile(data));
        } else {
          setProfile(null);
        }
      } catch {
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [loadProfile]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      loading,
      error,
      signInWithGoogle,
      signUp,
      signIn,
      signOut,
      clearError,
    }),
    [user, profile, loading, error, signInWithGoogle, signUp, signIn, signOut, clearError]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthInternal(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
