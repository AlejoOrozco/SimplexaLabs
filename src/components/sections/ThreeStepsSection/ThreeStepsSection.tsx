import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import './ThreeStepsSection.css';

const STEPS = [
  {
    number: 1,
    title: 'Reserva Tu Demo Gratis',
    subtitle: 'Llamada de 15 minutos para entender tu negocio',
    description:
      'Conocemos tu recorrido de clientes, desafíos y objetivos. Sin presión de ventas, solo una conversación sobre qué podría hacer la automatización por ti.',
    active: true,
  },
  {
    number: 2,
    title: 'Construimos Tu Automatización Personalizada',
    subtitle: 'Adaptada a tu negocio en 48 horas',
    description:
      'Nuestro equipo crea flujos de conversación inteligentes diseñados específicamente para tus servicios, productos y preguntas. Apruebas todo antes del lanzamiento.',
    active: false,
  },
  {
    number: 3,
    title: 'Activa y Comienza a Convertir',
    subtitle: 'Siéntate y mira fluir los clientes',
    description:
      'Tu asistente de IA comienza a manejar conversaciones, reservar citas y calificar clientes 24/7. Te enfocas en cerrar tratos y crecer tu negocio.',
    active: false,
  },
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.08 + 0.1 };
}

export function ThreeStepsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-three-steps" className="three-steps" ref={ref}>
      <div className="three-steps__container">
        <motion.h2
          className="three-steps__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          Comienza en 3 Pasos Simples
        </motion.h2>
        <div className="three-steps__timeline">
          <div className="three-steps__path" aria-hidden>
            <svg
              className="three-steps__svg"
              viewBox="0 0 1000 260"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="threeStepsGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--color-azul-electrico)" />
                  <stop offset="55%" stopColor="var(--color-morado-ai)" />
                  <stop offset="100%" stopColor="var(--color-azul-electrico)" />
                </linearGradient>
              </defs>

              {/* Glow underlay */}
              <path
                d="M 20 210 C 210 135, 260 175, 360 150 S 560 180, 650 120 S 830 45, 980 70"
                fill="none"
                stroke="url(#threeStepsGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                opacity="0.22"
              />

              {/* Main stroke */}
              <path
                d="M 20 210 C 210 135, 260 175, 360 150 S 560 180, 650 120 S 830 45, 980 70"
                fill="none"
                stroke="url(#threeStepsGradient)"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <div className="three-steps__steps">
            {STEPS.map((step, i) => (
              <motion.article
                key={i}
                data-step={step.number}
                className={`three-steps__step three-steps__step--${step.number}`}
                initial={hidden}
                animate={inView ? visible : hidden}
                transition={delay(1 + i)}
              >
                <div className="three-steps__marker-row" aria-hidden>
                  <span className={`three-steps__marker ${step.active ? 'three-steps__marker--active' : ''}`}>
                    <span className="three-steps__marker-icon">
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  </span>
                </div>

                <div className="three-steps__card">
                  <div className="three-steps__card-header">
                    <span className="three-steps__mobile-number" aria-hidden>
                      {step.number}
                    </span>
                    <div className="three-steps__content">
                      <h3 className="three-steps__card-title">{step.title}</h3>
                      <p className="three-steps__subtitle">{step.subtitle}</p>
                    </div>
                  </div>
                  <p className="three-steps__desc">{step.description}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
