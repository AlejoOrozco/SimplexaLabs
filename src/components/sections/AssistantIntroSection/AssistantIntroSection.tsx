import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import './AssistantIntroSection.css';

const FEATURES = [
  'Respuestas instantáneas a cada consulta de cliente, a cualquier hora',
  'Reserva de citas sin complicaciones ni intercambios innecesarios',
  'Transferencia a humanos cuando preguntas complejas requieren tu expertise',
  'Calificación automática de clientes para hablar solo con compradores serios',
  'Flujos de conversación inteligentes que guían a prospectos hacia la compra',
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.06 + 0.1 };
}

export function AssistantIntroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-assistant-intro" className="assistant-intro" ref={ref}>
      <div className="assistant-intro__container">
        <motion.h2
          className="assistant-intro__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          Presentamos Tu Asistente de Ventas y Soporte 24/7 con IA
        </motion.h2>
        <motion.p
          className="assistant-intro__paragraph"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(1)}
        >
          SimpLexaLabs construye sistemas de automatización inteligentes que manejan conversaciones
          con clientes en WhatsApp, Instagram y tu sitio web, de forma instantánea, precisa y
          profesional.
        </motion.p>
        <ul className="assistant-intro__list">
          {FEATURES.map((text, i) => (
            <motion.li
              key={i}
              className="assistant-intro__item"
              initial={hidden}
              animate={inView ? visible : hidden}
              transition={delay(2 + i)}
            >
              <span className="assistant-intro__check" aria-hidden>✓</span>
              {text}
            </motion.li>
          ))}
        </ul>
        <motion.p
          className="assistant-intro__closing"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(7)}
        >
          Piénsalo como contratar tu mejor vendedor, que nunca duerme, nunca se toma un descanso y
          conversaciones ilimitadas simultáneamente.
        </motion.p>
      </div>
    </section>
  );
}
