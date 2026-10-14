import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DroneIcon, TimerIcon, TrendIcon } from "@/components/icons";

/**
 * Landing page — estilo Neo-Geo.
 * Patrones geométricos de precisión, retícula isométrica sutil, trazos finos,
 * nodos conectados (trayectoria de vuelo) y acentos eléctricos (cian/naranja)
 * sobre fondo oscuro profundo. Una sola página, un único recorrido de scroll.
 */

/** Retícula triangular isométrica de fondo (líneas finas de baja opacidad). */
function GeoGrid({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className ?? ""}`} aria-hidden="true">
      <svg className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="isogrid" width="56" height="97" patternUnits="userSpaceOnUse">
            <path
              d="M28 0 L56 48.5 L28 97 L0 48.5 Z M0 48.5 L56 48.5 M28 0 L28 97"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#isogrid)" />
      </svg>
    </div>
  );
}

/** Trayectoria de vuelo: polilínea con nodos, el motivo central Neo-Geo. */
function FlightPath({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 420" className={className} aria-hidden="true">
      {/* Trayectoria principal */}
      <polyline
        points="30,330 120,240 210,270 300,140 390,90"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
      />
      {/* Trayectoria secundaria (punteada) */}
      <polyline
        points="30,330 90,390 210,300 330,330 390,90"
        fill="none"
        stroke="#f97316"
        strokeWidth="1.5"
        strokeDasharray="6 6"
      />
      {/* Nodos */}
      {[
        [30, 330],
        [120, 240],
        [210, 270],
        [300, 140],
        [390, 90],
        [210, 300],
        [330, 330],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#020617" stroke="#22d3ee" strokeWidth="2" />
          <circle cx={x} cy={y} r="2.5" fill="#22d3ee" />
        </g>
      ))}
      {/* Nodo destino destacado */}
      <circle cx="390" cy="90" r="12" fill="none" stroke="#f97316" strokeWidth="2" />
      <circle cx="390" cy="90" r="4" fill="#f97316" />
      {/* Dron en el punto de partida de la ruta */}
      <g stroke="#f97316" strokeWidth="1.5" fill="none">
        <circle cx="18" cy="318" r="5" />
        <circle cx="42" cy="318" r="5" />
        <circle cx="18" cy="342" r="5" />
        <circle cx="42" cy="342" r="5" />
        <line x1="22" y1="322" x2="26" y2="326" />
        <line x1="38" y1="322" x2="34" y2="326" />
        <line x1="22" y1="338" x2="26" y2="334" />
        <line x1="38" y1="338" x2="34" y2="334" />
        <circle cx="30" cy="330" r="3" fill="#f97316" stroke="none" />
      </g>
      {/* Referencias geométricas */}
      <circle cx="210" cy="210" r="150" fill="none" stroke="#334155" strokeWidth="0.75" strokeDasharray="2 6" />
      <line x1="0" y1="210" x2="420" y2="210" stroke="#1e293b" strokeWidth="0.75" />
      <line x1="210" y1="0" x2="210" y2="420" stroke="#1e293b" strokeWidth="0.75" />
    </svg>
  );
}

const features = [
  {
    number: "01",
    icon: <DroneIcon className="h-6 w-6" />,
    title: "Práctica por tema",
    description:
      "Practica preguntas por categoría y tema con corrección inmediata opcional y explicaciones de cada respuesta.",
    cta: "Empezar a practicar",
    href: "/login",
  },
  {
    number: "02",
    icon: <TimerIcon className="h-6 w-6" />,
    title: "Simulacros cronometrados",
    description:
      "Realiza exámenes con temporizador y las mismas condiciones que el examen real. La corrección se calcula en el servidor.",
    cta: "Hacer un simulacro",
    href: "/login",
  },
  {
    number: "03",
    icon: <TrendIcon className="h-6 w-6" />,
    title: "Seguimiento de progreso",
    description:
      "Consulta tu historial, repasa tus errores y observa la evolución de tu rendimiento por tema.",
    cta: "Ver estadísticas",
    href: "/login",
  },
];

const steps = [
  {
    number: "01",
    title: "Elige tu formación",
    description: "Selecciona la categoría o el tema que quieres trabajar y el número de preguntas.",
  },
  {
    number: "02",
    title: "Practica y simula",
    description: "Responde con corrección inmediata o a ciegas, con temporizador, como en el examen real.",
  },
  {
    number: "03",
    title: "Revisa y mejora",
    description: "Analiza tus errores, marca favoritos y mide tu evolución hasta el día del examen.",
  },
];

export default function Home() {
  return (
    <main className="flex-1 bg-slate-950">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <GeoGrid className="text-slate-700 opacity-30" />
        {/* Halo de luz sutil */}
        <div
          className="pointer-events-none absolute -top-40 left-1/3 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container relative mx-auto grid gap-12 px-4 py-16 sm:py-24 lg:grid-cols-[1fr_auto] lg:items-center">
          {/* Texto */}
          <div>
            <span className="inline-flex items-center gap-2 border border-slate-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" aria-hidden="true" />
              No es una aplicación oficial de AESA
            </span>

            <h1 className="mt-8 text-6xl font-black leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
              Dron
              <span className="text-cyan-400">Test</span>
            </h1>

            <p className="mt-4 font-mono text-sm uppercase tracking-[0.25em] text-slate-500">
              Formación · Simulación · Progreso
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-300 sm:text-xl">
              Practica con preguntas tipo test para la formación de pilotos de
              drones. Simulacros cronometrados, explicaciones de respuestas y
              seguimiento de tu progreso.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-12 rounded-none bg-cyan-400 px-8 text-base font-bold uppercase tracking-wide text-slate-950 hover:bg-cyan-300">
                <Link href="/login">Empezar ahora</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 rounded-none border-slate-600 px-8 text-base font-bold uppercase tracking-wide text-white hover:border-cyan-400 hover:text-cyan-400">
                <Link href="/simulacros">Ver simulacros</Link>
              </Button>
            </div>
          </div>

          {/* Trayectoria de vuelo */}
          <div className="relative hidden lg:block">
            <FlightPath className="h-[420px] w-[420px]" />
            <span className="absolute right-2 top-2 font-mono text-xs tracking-widest text-slate-500">
              RUTA-01
            </span>
            <span className="absolute bottom-2 left-2 font-mono text-xs tracking-widest text-slate-500">
              45.4642° N · 7.2185° W
            </span>
          </div>
        </div>

        {/* Línea de precisión */}
        <div className="relative border-t border-slate-800">
          <div className="container mx-auto flex items-center justify-between px-4 py-3 font-mono text-xs tracking-widest text-slate-500">
            <span>SISTEMA DE PRÁCTICA PARA PILOTOS DE DRONES</span>
            <span className="hidden sm:inline">v1.0</span>
          </div>
        </div>
      </section>

      {/* ============ BLOQUES / FEATURES ============ */}
      <section className="relative border-t border-slate-800">
        <div className="container mx-auto px-4 py-16 sm:py-24">
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-400">
            {"// La plataforma"}
          </p>
          <h2 className="mt-4 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Tres módulos. Un objetivo: aprobar.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {features.map((f) => (
              <article
                key={f.number}
                className="group relative border border-slate-800 bg-slate-900/60 p-6 transition-colors duration-150 hover:border-cyan-400/60"
              >
                {/* Marcador geométrico de esquina */}
                <span
                  className="absolute right-0 top-0 h-3 w-3 border-r border-t border-cyan-400"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm tracking-widest text-slate-500">
                    MÓD-{f.number}
                  </span>
                  <span className="text-cyan-400">{f.icon}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{f.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-400">
                  {f.description}
                </p>
                <Link
                  href={f.href}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-cyan-400 transition-colors hover:text-cyan-300"
                >
                  {f.cta}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESO ============ */}
      <section className="relative border-t border-slate-800">
        <GeoGrid className="text-slate-800 opacity-20" />
        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-orange-500">
            {"// El método"}
          </p>
          <h2 className="mt-4 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl">
            Del temario al examen.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.number} className="relative">
                {/* Conector horizontal (solo md+) */}
                {i < steps.length - 1 && (
                  <span
                    className="absolute -right-6 top-10 hidden h-px w-6 bg-slate-700 md:block"
                    aria-hidden="true"
                  />
                )}
                <div className="relative border border-slate-800 bg-slate-900/60 p-8">
                  <span
                    className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center border border-cyan-400 bg-slate-950 font-mono text-xs text-cyan-400"
                    aria-hidden="true"
                  >
                    {s.number}
                  </span>
                  <h3 className="mt-4 text-lg font-bold text-white">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA FINAL ============ */}
      <section className="relative overflow-hidden border-t border-slate-800">
        <GeoGrid className="text-slate-700 opacity-25" />
        <div
          className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="container relative mx-auto px-4 py-16 sm:py-24">
          <p className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-400">
            {"// Próximo paso"}
          </p>
          <h2 className="mt-4 max-w-2xl text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">
            Tu examen empieza ahora.
          </h2>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Crea tu cuenta gratuita y empieza a practicar hoy mismo.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="h-12 rounded-none bg-orange-500 px-8 text-base font-bold uppercase tracking-wide text-white hover:bg-orange-400">
              <Link href="/register">Crear cuenta gratis</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-none border-slate-600 px-8 text-base font-bold uppercase tracking-wide text-white hover:border-orange-500 hover:text-orange-400">
              <Link href="/simulacros">Ver simulacros</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
