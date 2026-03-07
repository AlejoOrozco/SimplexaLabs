import { useEffect } from 'react';
import { sileo } from 'sileo';

const FIRST_NAMES = [
  'Alejandro',
  'Sofía',
  'Valentina',
  'Mateo',
  'Santiago',
  'Camila',
  'Daniela',
  'Mariana',
  'Juan',
  'Juan José',
  'Carlos',
  'Andrés',
  'Sebastián',
  'David',
  'Diego',
  'Luis',
  'Ricardo',
  'Javier',
  'Fernando',
  'Pablo',
  'Gabriel',
  'Emiliano',
  'Nicolás',
  'Tomás',
  'Martín',
  'Pedro',
  'José',
  'Miguel',
  'Ángel',
  'Héctor',
  'Paola',
  'Lucía',
  'Ana',
  'Andrea',
  'Carolina',
  'Isabella',
  'Renata',
  'Gabriela',
  'Regina',
  'Victoria',
  'Mónica',
  'Karla',
  'Natalia',
  'Laura',
  'Patricia',
  'Claudia',
  'Verónica',
  'Cecilia',
  'Rosa',
  'Felipe',
  'Roberto',
  'Hugo',
  'Marco',
  'Marcos',
  'Iván',
  'Óscar',
  'Cristian',
  'Esteban',
  'Alberto',
  'Gonzalo',
];

const LAST_INITIALS = [
  'G.',
  'R.',
  'S.',
  'P.',
  'M.',
  'L.',
  'C.',
  'H.',
  'V.',
  'T.',
  'D.',
  'A.',
  'F.',
  'J.',
  'B.',
  'N.',
  'E.',
  'K.',
  'O.',
  'Q.',
  'Z.',
  'I.',
  'U.',
  'X.',
];

const PLANS = ['básico', 'medio', 'completo', 'enterprise'] as const;

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T;
}

function randomMs(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

/**
 * Recurring social-proof toast (random name + plan).
 * Uses a recursive timeout (not interval) so we can randomize timing each time.
 *
 * Note: React StrictMode runs effects twice in dev; cleanup prevents duplicates.
 */
export function useRecurrentPurchaseToasts() {
  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    const tick = () => {
      if (cancelled) return;

      const name = `${pick(FIRST_NAMES)} ${pick(LAST_INITIALS)}`;
      const plan = pick(PLANS);

      sileo.success({
        title: `${name} acaba de adquirir el plan ${plan}.`,
        duration: 3500,
      });

      timeoutId = window.setTimeout(tick, randomMs(14000, 28000));
    };

    timeoutId = window.setTimeout(tick, randomMs(6000, 12000));

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);
}

