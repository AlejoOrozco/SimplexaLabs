import { motion } from 'framer-motion';
import {
  SiMeta,
  SiFacebook,
  SiInstagram,
  SiWhatsapp,
} from '@icons-pack/react-simple-icons';
import './PartnerBadge.css';

const PARTNERS = [
  { Icon: SiMeta, label: 'Meta', color: '#0668E1' },
  { Icon: SiFacebook, label: 'Facebook', color: '#1877F2' },
  { Icon: SiInstagram, label: 'Instagram', color: '#E4405F' },
  { Icon: SiWhatsapp, label: 'WhatsApp', color: '#25D366' },
] as const;

export function PartnerBadge() {
  return (
    <motion.div
      className="partner-badge"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="partner-badge__icons" aria-hidden>
        {PARTNERS.map(({ Icon, label, color }) => (
          <span
            key={label}
            className="partner-badge__icon-wrap"
            style={{ backgroundColor: color }}
          >
            <Icon size={14} color="#fff" />
          </span>
        ))}
      </div>
      <span className="partner-badge__text">Proveedor de Soluciones Empresariales</span>
    </motion.div>
  );
}
