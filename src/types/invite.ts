export type InviteStatus = "pending" | "accepted";

export interface Invite {
  id: string;
  email: string;
  plan: string;
  role: string;
  invitedBy: string;
  status: InviteStatus;
  createdAt: Date;
}
