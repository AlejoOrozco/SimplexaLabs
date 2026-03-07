import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { LiquidGlassCard } from '../../LiquidGlassCard';
import './AutomationChannelsSection.css';

const CARDS = [
  {
    title: 'Automatización de WhatsApp',
    description:
      'Convierte WhatsApp en tu canal de ventas más poderoso. Nuestra IA responde preguntas, califica clientes, reserva citas y envía seguimientos automáticamente.',
    icon: '💬',
  },
  {
    title: 'Automatización de Chat Web',
    description:
      'Convierte visitantes de tu sitio en citas reservadas con chat inteligente que engancha, califica y programa, sin que tu equipo haga nada.',
    icon: '⚡',
  },
  {
    title: 'Automatización de DM de Instagram',
    description:
      'Responde automáticamente a consultas de Instagram, contesta preguntas sobre productos y guía seguidores para reservar citas o hacer compras.',
    icon: '📈',
  },
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.08 + 0.1 };
}

export function AutomationChannelsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-automation-channels" className="automation-channels" ref={ref}>
      <div className="automation-channels__bg" aria-hidden />
      <div className="automation-channels__container">
        <motion.h2
          className="automation-channels__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          Todo Lo Que Necesitas Para Automatizar Tu Recorrido de Clientes
        </motion.h2>
        <div className="automation-channels__grid">
          {CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={hidden}
              animate={inView ? visible : hidden}
              transition={delay(1 + i)}
            >
              <LiquidGlassCard size="default" className="automation-channels__card">
                <span className="automation-channels__icon" aria-hidden>
                  {card.icon}
                </span>
                <h3 className="automation-channels__card-title">{card.title}</h3>
                <p className="automation-channels__card-desc">{card.description}</p>
              </LiquidGlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
