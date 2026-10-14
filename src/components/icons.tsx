/**
 * Iconos SVG temáticos de UAS / formación de pilotos de drones.
 * Trazos finos (stroke) alineados con el estilo Neo-Geo de la landing.
 * Todos heredan el color mediante `currentColor`.
 */

interface IconProps {
  className?: string;
}

/** Dron cuadricóptero (vista superior): 4 rotores, brazos y cuerpo central. */
export function DroneIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="3.25" />
      <circle cx="19" cy="5" r="3.25" />
      <circle cx="5" cy="19" r="3.25" />
      <circle cx="19" cy="19" r="3.25" />
      <line x1="7.5" y1="7.5" x2="10.2" y2="10.2" />
      <line x1="16.5" y1="7.5" x2="13.8" y2="10.2" />
      <line x1="7.5" y1="16.5" x2="10.2" y2="13.8" />
      <line x1="16.5" y1="16.5" x2="13.8" y2="13.8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Radar de vigilancia: anillos concéntricos, barrido y objetivo detectado. */
export function RadarIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4.5" strokeDasharray="2 2.5" />
      <line x1="12" y1="12" x2="18.4" y2="5.6" />
      <circle cx="15.5" cy="15.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Cronómetro: reloj de simulacro con corona superior y manecillas. */
export function TimerIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="13.5" r="7.5" />
      <line x1="10" y1="2.5" x2="14" y2="2.5" />
      <line x1="12" y1="2.5" x2="12" y2="6" />
      <line x1="12" y1="13.5" x2="12" y2="8.5" />
      <line x1="12" y1="13.5" x2="15.5" y2="13.5" />
    </svg>
  );
}

/** Tendencia ascendente: evolución del rendimiento con flecha de destino. */
export function TrendIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={className}
      aria-hidden="true"
    >
      <polyline points="3,17 9,11 13,14 20,7" />
      <polyline points="14.5,7 20,7 20,12.5" />
    </svg>
  );
}
