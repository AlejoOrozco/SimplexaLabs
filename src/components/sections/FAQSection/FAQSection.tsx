import { useState, useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import './FAQSection.css';

const FAQ_ITEMS = [
  {
    question: '¿Los clientes saben que hablan con IA?',
    answer:
      'Las conversaciones son naturales y útiles. Muchos clientes no notan la diferencia; cuando hace falta, la IA puede transferir a un humano sin problema.',
  },
  {
    question: '¿Cuánto tarda la configuración?',
    answer:
      'Activamos tu automatización en 48 horas. Trabajamos contigo para definir flujos, respuestas y criterios antes del lanzamiento.',
  },
  {
    question: '¿Qué pasa si la IA no entiende una pregunta?',
    answer:
      'La IA está entrenada para reconocer cuándo debe transferir a un humano. Las preguntas complejas o fuera de flujo pasan a tu equipo.',
  },
  {
    question: '¿Puedo personalizar las respuestas?',
    answer:
      'Sí. Diseñamos los flujos y textos según tu voz, servicios y recorrido de clientes. Apruebas todo antes de activar.',
  },
  {
    question: '¿Necesito conocimientos técnicos?',
    answer:
      'No. Nos encargamos de la configuración y el soporte. Tú solo nos cuentas tu negocio y revisas los resultados.',
  },
  {
    question: '¿Cuánto cuesta?',
    answer:
      'Depende de tu volumen y canales. En la demo gratuita te presentamos opciones adaptadas a tu negocio y presupuesto.',
  },
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.06 + 0.1 };
}

export function FAQSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="section-faq" className="faq" ref={ref}>
      <div className="faq__container">
        <motion.h2
          className="faq__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          Preguntas Frecuentes
        </motion.h2>
        <div className="faq__list">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              className="faq__item"
              initial={hidden}
              animate={inView ? visible : hidden}
              transition={delay(1 + i * 0.05)}
            >
              <button
                type="button"
                className="faq__question"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                {item.question}
                <span className="faq__chevron" aria-hidden>
                  {openIndex === i ? '▲' : '▼'}
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className={`faq__answer ${openIndex === i ? 'faq__answer--open' : ''}`}
              >
                <p className="faq__answer-inner">{item.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
