import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { CtaBorderWrap } from '../../CtaBorderWrap';
import { PartnerBadge } from '../../PartnerBadge';
import { ShimmerText } from '../../ShimmerText';
import { BackgroundPaths } from '../../ui/background-paths';
import GradualBlur from '../../ui/GradualBlur';
import './HeroSection.css';

const hidden = { opacity: 0, y: 24 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const };

function delay(i: number) {
  return { ...transition, delay: i * 0.08 + 0.1 };
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="section-hero" className="hero" ref={ref}>
      <BackgroundPaths className="hero__paths" />
      <div className="hero__container">
        <motion.h1
          className="hero__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          <ShimmerText className="hero__title-line" text="Nunca pierdas otro cliente." />
          <ShimmerText
            className="hero__title-line hero__title-line--shimmer-fade"
            text="Automatiza conversaciones 24/7."
          />
        </motion.h1>
        <motion.p
          className="hero__subtitle"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(1)}
        >
          SimplexaLabs ayuda a los negocios a responder al instante, calificar clientes potenciales
          automáticamente y reservar más citas en WhatsApp, Instagram y tu sitio web, sin contratar
          más personal.
        </motion.p>
        <motion.div
          className="hero__ctas"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(2)}
        >
          <CtaBorderWrap>
            <a href="#demo" className="hero__cta hero__cta--primary cta-gradient-fill">
              Reserva Tu Demo Gratis <span aria-hidden>→</span>
            </a>
          </CtaBorderWrap>
          <CtaBorderWrap outline>
            <a href="#como-funciona" className="hero__cta hero__cta--secondary cta-gradient-fill">
              Ver Cómo Funciona
            </a>
          </CtaBorderWrap>
        </motion.div>
        <motion.ul
          className="hero__benefits"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(3)}
        >
          <li>
            <span className="hero__check" aria-hidden>✓</span>
            Configuración en 48 horas
          </li>
          <li>
            <span className="hero__check" aria-hidden>✓</span>
            Sin tarjeta de crédito
          </li>
          <li>
            <span className="hero__check" aria-hidden>✓</span>
            Cancela cuando quieras
          </li>
        </motion.ul>
        <motion.div
          className="hero__partner"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(4)}
        >
          <PartnerBadge />
        </motion.div>
      </div>
      <GradualBlur
        target="page"
        position="bottom"
        height="7rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={20}
        className="hero__blur-edge"
      />
    </section>
  );
}
