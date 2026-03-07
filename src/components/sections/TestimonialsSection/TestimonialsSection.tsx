import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import './TestimonialsSection.css';

const TESTIMONIALS = [
  {
    quote:
      'Antes se nos iban leads por no contestar rápido. Ahora la mayoría se agenda solita y nosotros solo cerramos.',
    name: 'María Fernanda R.',
    title: 'Dueña de estética',
  },
  {
    quote:
      'Lo mejor es que ya no estamos pegados al WhatsApp. Llegan calificados y con horario listo, así da gusto.',
    name: 'Carlos A.',
    title: 'Ventas B2C',
  },
  {
    quote:
      'Sinceramente pensé que iba a ser un lío… pero quedó fino. Responde bien, filtra curiosos y agenda.',
    name: 'Valentina G.',
    title: 'Clínica dental',
  },
  {
    quote:
      'Nos bajó el “¿cuánto cuesta?” repetido mil veces. Ahora el equipo se mete solo cuando ya es un cliente serio.',
    name: 'Javier P.',
    title: 'Servicios profesionales',
  },
  {
    quote:
      'De noche y fines de semana es cuando más escriben. Antes se perdía todo, hoy amanezco con citas listas.',
    name: 'Daniela S.',
    title: 'Inmobiliaria',
  },
  {
    quote:
      'Literalmente recuperamos ventas que se iban por demora. El tiempo de respuesta cambió todo.',
    name: 'Luis F.',
    title: 'E-commerce',
  },
  {
    quote:
      'Me gustó que se siente “humano”. La gente responde normal y el flujo los lleva directo a agendar.',
    name: 'Camila T.',
    title: 'Entrenadora personal',
  },
  {
    quote:
      'Antes el equipo se saturaba con mensajes. Ahora todo está ordenado y solo entramos cuando toca cerrar.',
    name: 'Andrés M.',
    title: 'Gerente comercial',
  },
  {
    quote:
      'La agenda ya no es un caos. Te preguntan, el bot propone horarios y listo. Cero ida y vuelta.',
    name: 'Paola C.',
    title: 'Centro de fisioterapia',
  },
  {
    quote:
      'Se paga solo. Con que cierres 1–2 ventas más al mes ya lo justificas, y nosotros subimos bastante más.',
    name: 'Ricardo V.',
    title: 'Academia / cursos',
  },
  {
    quote:
      'Nos ayudó a responder IG y WhatsApp al mismo tiempo sin contratar a nadie. Eso fue clave.',
    name: 'Sofía L.',
    title: 'Marca DTC',
  },
  {
    quote:
      'Lo implementaron rápido y quedó estable. Ya no me preocupa “perder chats” cuando hay pico de mensajes.',
    name: 'Juan José H.',
    title: 'Servicios a domicilio',
  },
];

const hidden = { opacity: 0, y: 20 };
const visible = { opacity: 1, y: 0 };
const transition = { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const };
function delay(i: number) {
  return { ...transition, delay: i * 0.08 + 0.1 };
}

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <section id="section-testimonials" className="testimonials" ref={ref}>
      <div className="testimonials__container">
        <motion.h2
          className="testimonials__title"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(0)}
        >
          Confían en nosotros los negocios que valoran su tiempo
        </motion.h2>
        <motion.div
          className="testimonials__marquee"
          initial={hidden}
          animate={inView ? visible : hidden}
          transition={delay(1)}
        >
          <div className="testimonials__track" aria-label="Reseñas de clientes">
            {[0, 1].map((dup) => (
              <div className="testimonials__group" key={dup} aria-hidden={dup === 1}>
                {TESTIMONIALS.map((t, i) => (
                  <article className="testimonials__card" key={`${dup}-${i}-${t.name}`}>
                    <div className="testimonials__stars" aria-hidden>
                      ★★★★★
                    </div>
                    <blockquote className="testimonials__quote">"{t.quote}"</blockquote>
                    <p className="testimonials__name">{t.name}</p>
                    <p className="testimonials__role">{t.title}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
