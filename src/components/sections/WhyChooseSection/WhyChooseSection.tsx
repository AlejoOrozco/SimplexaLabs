import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import './WhyChooseSection.css';

const ITEMS = [
  {
    title: 'Configuración Rápida, Resultados Reales',
    description:
      'Activa en 48 horas, no semanas. Comienza a capturar clientes y reservar citas de inmediato.',
  },
  {
    title: 'Realmente Inteligente',
    description:
      'Nuestra IA entiende contexto, maneja preguntas complejas y sabe cuándo traer un humano, creando conversaciones naturales y útiles.',
  },
  {
    title: 'Soporte Continuo y Optimización',
    description:
      'No construimos y desaparecemos. Mejoras continuas, monitoreo de rendimiento y soporte dedicado incluido.',
  },
  {
    title: 'Personalizado Para Tu Negocio',
    description:
      'Sin plantillas genéricas. Diseñamos flujos que coinciden con tu voz, servicios y recorrido de clientes.',
  },
  {
    title: 'Transparencia Total',
    description:
      'Rastrea cada conversación, mide tasas de conversión y ve exactamente cómo impacta la automatización tu resultado.',
  },
  {
    title: 'Construido Para Negocios Crecientes',
    description:
      'Ya sea 10 mensajes o 10,000 por mes, nuestros sistemas escalan sin esfuerzo con tu crecimiento.',
  },
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.06 + 0.1 };
}

export function WhyChooseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-why-choose" className="why-choose" ref={ref}>
      <div className="why-choose__container">
        <motion.h2
          className="why-choose__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          Por Qué Los Negocios Eligen SimpLexaLabs
        </motion.h2>
        <div className="why-choose__grid">
          {ITEMS.map((item, i) => (
            <motion.div
              key={i}
              className="why-choose__item"
              initial={hidden}
              animate={inView ? visible : hidden}
              transition={delay(1 + i)}
            >
              <span className="why-choose__icon" aria-hidden>
                🛡
              </span>
              <div>
                <h3 className="why-choose__item-title">{item.title}</h3>
                <p className="why-choose__item-desc">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
