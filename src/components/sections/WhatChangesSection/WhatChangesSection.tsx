import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  DollarSign,
  Moon,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '../../../lib/utils';
import './WhatChangesSection.css';

// ─── Constants ─────────────────────────────────────────────────────────────

const TILT_MAX = 9;
const TILT_SPRING = { stiffness: 300, damping: 28 } as const;
const GLOW_SPRING = { stiffness: 180, damping: 22 } as const;

// ─── Data ──────────────────────────────────────────────────────────────────

export interface SpotlightItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const ITEMS: SpotlightItem[] = [
  {
    icon: Zap,
    title: 'Responde en Segundos, No Horas',
    description:
      'Deja de perder clientes impacientes. Nuestra IA responde al instante a cada mensaje, manteniendo prospectos comprometidos y avanzando hacia la venta.',
    color: '#2563eb',
  },
  {
    icon: DollarSign,
    title: 'Aumenta Ingresos Sin Contratar',
    description:
      'Maneja 10x más conversaciones sin expandir tu equipo. Nuestra automatización crece con tu negocio.',
    color: '#0d9488',
  },
  {
    icon: Moon,
    title: 'Trabaja Más Inteligente, No Más Duro',
    description:
      'Despierta con un calendario lleno de citas y un pipeline de clientes calificados, todo manejado automáticamente.',
    color: '#7c3aed',
  },
  {
    icon: Calendar,
    title: 'Llena Tu Calendario Automáticamente',
    description:
      'Sin más ir y venir de horarios. Los clientes reservan sus propias citas a través de flujos de conversación que se sincronizan con tu calendario.',
    color: '#0284c7',
  },
  {
    icon: Target,
    title: 'Enfócate en Oportunidades Reales',
    description:
      'Deja que la IA maneje FAQs. Tu equipo solo se involucra con prospectos calificados listos para comprar.',
    color: '#6366f1',
  },
  {
    icon: TrendingUp,
    title: 'Nunca Pierdas Un Cliente Otra Vez',
    description:
      'Captura cada consulta de WhatsApp, Instagram y tu sitio web. Ningún mensaje sin responder, ninguna oportunidad perdida.',
    color: '#059669',
  },
];

// ─── Card ───────────────────────────────────────────────────────────────────

interface CardProps {
  item: SpotlightItem;
  dimmed: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

function Card({ item, dimmed, onHoverStart, onHoverEnd }: CardProps) {
  const Icon = item.icon;
  const cardRef = useRef<HTMLDivElement>(null);

  const normX = useMotionValue(0.5);
  const normY = useMotionValue(0.5);

  const rawRotateX = useTransform(normY, [0, 1], [TILT_MAX, -TILT_MAX]);
  const rawRotateY = useTransform(normX, [0, 1], [-TILT_MAX, TILT_MAX]);

  const rotateX = useSpring(rawRotateX, TILT_SPRING);
  const rotateY = useSpring(rawRotateY, TILT_SPRING);
  const glowOpacity = useSpring(0, GLOW_SPRING);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    normX.set((e.clientX - rect.left) / rect.width);
    normY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseEnter = () => {
    glowOpacity.set(1);
    onHoverStart();
  };

  const handleMouseLeave = () => {
    normX.set(0.5);
    normY.set(0.5);
    glowOpacity.set(0);
    onHoverEnd();
  };

  return (
    <motion.div
      animate={{
        scale: dimmed ? 0.96 : 1,
        opacity: dimmed ? 0.5 : 1,
      }}
      className={cn(
        'what-changes-card group relative flex flex-col gap-5 overflow-hidden rounded-2xl border p-6',
        'transition-[border-color] duration-300'
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 900,
      }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
    >
      {/* Static accent tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}18, transparent 65%)`,
        }}
      />

      {/* Hover glow layer */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          opacity: glowOpacity,
          background: `radial-gradient(ellipse at 20% 20%, ${item.color}28, transparent 65%)`,
        }}
      />

      {/* Shimmer sweep */}
      <div
        aria-hidden="true"
        className="what-changes-card__shimmer"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)',
        }}
      />

      {/* Icon badge */}
      <div
        className="what-changes-card__icon-badge"
        style={{
          background: `${item.color}22`,
          boxShadow: `inset 0 0 0 1px ${item.color}40`,
        }}
      >
        <Icon size={17} strokeWidth={1.9} style={{ color: item.color }} />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-2">
        <h3 className="what-changes-card__title">
          {item.title}
        </h3>
        <p className="what-changes-card__description">
          {item.description}
        </p>
      </div>

      {/* Accent bottom line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[2px] w-0 rounded-full transition-all duration-500 group-hover:w-full"
        style={{
          background: `linear-gradient(to right, ${item.color}80, transparent)`,
        }}
      />
    </motion.div>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

export function WhatChangesSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  return (
    <section id="section-what-changes" className="what-changes" ref={ref}>
      <div className="what-changes__container">
        <motion.h2
          className="what-changes__title"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Lo Que Cambia Cuando Automatizas Con SimpLexaLabs
        </motion.h2>

        {/* Dot grid — visible in light mode for texture */}
        <div
          aria-hidden="true"
          className="what-changes__dot-grid"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(0,0,0,0.055) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="what-changes__grid">
          {ITEMS.map((item) => (
            <Card
              dimmed={hoveredTitle !== null && hoveredTitle !== item.title}
              item={item}
              key={item.title}
              onHoverEnd={() => setHoveredTitle(null)}
              onHoverStart={() => setHoveredTitle(item.title)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
