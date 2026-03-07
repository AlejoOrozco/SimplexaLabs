import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import './PainPointsSection.css';

const PAIN_POINTS = [
  'Las respuestas lentas hacen que los clientes se pierdan o elijan a tu competidor',
  'Los mensajes perdidos en noches, fines de semana u horas pico te cuestan ventas',
  'El intercambio manual desperdicia el tiempo de tu equipo en preguntas repetitivas',
  'Sin sistema de seguimiento, los prospectos interesados se pierden',
  'El personal abrumado no puede manejar alto volumen de mensajes en horas pico',
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };

function delay(i: number) {
  return { ...transition, delay: i * 0.06 + 0.1 };
}

export function PainPointsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-pain-points" className="pain-points" ref={ref}>
      <div className="pain-points__container">
        <motion.h2
          className="pain-points__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          ¿Estás Perdiendo Dinero Porque Tu Negocio No Puede Mantenerse al Día?
        </motion.h2>

        <ul className="pain-points__list">
          {PAIN_POINTS.map((text, i) => (
            <motion.li
              key={i}
              className="pain-points__item"
              initial={hidden}
              animate={inView ? visible : hidden}
              transition={delay(i + 1)}
            >
              <span className="pain-points__icon" aria-hidden>
                ✕
              </span>
              {text}
            </motion.li>
          ))}
        </ul>

        <motion.h3
          className="pain-points__subtitle"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(6)}
        >
          ¿El resultado?
        </motion.h3>

        <motion.p
          className="pain-points__outcome"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(7)}
        >
          Ingresos perdidos. Clientes frustrados. Agotamiento.
        </motion.p>

        <motion.p
          className="pain-points__closing"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(8)}
        >
          No iniciaste tu negocio para pasar todo el día respondiendo las mismas preguntas o
          persiguiendo clientes manualmente.
        </motion.p>
      </div>
    </section>
  );
}
