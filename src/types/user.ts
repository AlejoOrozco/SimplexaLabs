/**
 * User profile stored in Firestore `users/{uid}`.
 * Matches the document shape we write on sign-up and read in the app.
 */
export type Plan = "free" | "basic" | "pro" | "enterprise";

export type SocialMediaPlatform =
  | "instagram"
  | "facebook"
  | "whatsapp"
  | "twitter";

export type UserRole = "user" | "admin";

export interface UserProfile {
  name: string;
  lastName: string;
  email: string;
  companyName?: string;
  plan: Plan;
  role?: UserRole; // admins can create accounts; set in Firestore manually
  createdAt: Date;
  updatedAt: Date;
  socialMedias: SocialMediaPlatform[];
}
