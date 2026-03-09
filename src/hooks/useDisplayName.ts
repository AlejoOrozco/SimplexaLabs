import { useAuth } from "./useAuth";

export function useDisplayName(): string {
  const { user, profile } = useAuth();
  return profile
    ? `${profile.name} ${profile.lastName}`.trim() || profile.email
    : user?.email ?? "Usuario";
}
