import { useRecurrentPurchaseToasts } from "../../hooks/useRecurrentPurchaseToasts";

/**
 * Component that runs the recurring purchase toast notifications
 * (e.g. "{name} acaba de adquirir el plan {plan}").
 * Renders nothing; the hook triggers sileo.success toasts.
 */
export function PurchaseNotifications() {
  useRecurrentPurchaseToasts();
  return null;
}
