import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { CtaBorderWrap } from '../../CtaBorderWrap';
import './CTASection.css';

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.08 + 0.1 };
}

const BENEFITS = [
  'Configuración en 48 horas',
  'Hecho a medida para tu negocio',
  'Cancela cuando quieras',
];

export function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-cta" className="cta-section" ref={ref}>
      <div className="cta-section__container">
        <motion.h2
          className="cta-section__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          ¿Listo para dejar de perder leads y reservar más citas?
        </motion.h2>
        <motion.p
          className="cta-section__paragraph"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(1)}
        >
          Cada día que esperas es un día más de oportunidades perdidas, ingresos que se escapan y
          equipo agotado. Reserva una demo gratuita de 15 minutos y descubre cómo SimpLexaLabs puede
          convertir las conversaciones con tus clientes en tratos cerrados.
        </motion.p>
        <motion.div
          className="cta-section__button-wrap"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(2)}
        >
          <CtaBorderWrap outline>
            <a href="#demo" className="cta-section__button cta-gradient-fill">
              Reserva Tu Demo Gratis Ahora
            </a>
          </CtaBorderWrap>
        </motion.div>
        <motion.ul
          className="cta-section__benefits"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(3)}
        >
          {BENEFITS.map((text, i) => (
            <li key={i}>
              <span className="cta-section__check" aria-hidden>✓</span>
              {text}
            </li>
          ))}
        </motion.ul>
        <motion.p
          className="cta-section__tagline"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(4)}
        >
          Sin compromiso. Sin presión. Solo resultados.
        </motion.p>
      </div>
    </section>
  );
}
