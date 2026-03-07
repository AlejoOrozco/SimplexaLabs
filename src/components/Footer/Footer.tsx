import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import './Footer.css';

const hidden = { opacity: 0, y: 16 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.08 + 0.1 };
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <footer id="footer" className="footer" ref={ref}>
      <div className="footer__container">
        <div className="footer__top">
          <motion.div
            className="footer__brand"
            initial={hidden}
            animate={inView ? visible : hidden}
            transition={delay(0)}
          >
            <p className="footer__name">SimpLexaLabs</p>
            <p className="footer__tagline">
              Automatiza conversaciones. Reserva más citas. Cierra más ventas.
            </p>
          </motion.div>
          <motion.div
            className="footer__cta"
            initial={hidden}
            animate={inView ? visible : hidden}
            transition={delay(1)}
          >
            <p className="footer__cta-text">¿Listo para transformar tu negocio?</p>
            <a href="#demo" className="footer__link">
              Reservar Demo
            </a>
          </motion.div>
        </div>
        <div className="footer__separator" aria-hidden />
        <div className="footer__bottom">
          <p className="footer__copyright">© 2026 SimpLexaLabs. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
