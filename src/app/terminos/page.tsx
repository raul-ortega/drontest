import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos — DronTest",
  description: "Términos de uso de la plataforma DronTest.",
};

export default function TerminosPage() {
  return (
    <main className="flex-1 bg-slate-950">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-400">
          {"// Términos"}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
          Términos de uso
        </h1>

        <div className="mt-8 space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white">
              1. Naturaleza del servicio
            </h2>
            <p className="mt-2">
              DronTest es una herramienta de práctica y preparación para
              exámenes tipo test de la formación de pilotos de drones. No es
              una aplicación oficial, certificada ni avalada por AESA, y su
              uso no garantiza la superación del examen oficial.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              2. Cuenta del usuario
            </h2>
            <p className="mt-2">
              El usuario es responsable de la veracidad de los datos
              facilitados en el registro y de la confidencialidad de sus
              credenciales. Queda prohibido el uso de la cuenta por terceros o
              la compartición de acceso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              3. Contenido y propiedad intelectual
            </h2>
            <p className="mt-2">
              El banco de preguntas es material de práctica elaborado a partir
              de documentación pública y de preguntas originales. La
              reutilización del contenido más allá del uso personal en la
              plataforma no está permitida sin autorización expresa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              4. Conducta del usuario
            </h2>
            <p className="mt-2">
              Queda prohibido intentar acceder a datos de otros usuarios,
              manipular las respuestas o puntuaciones, o utilizar la
              plataforma para fines distintos de la preparación de exámenes.
              El incumplimiento puede dar lugar a la suspensión de la cuenta.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              5. Limitación de responsabilidad
            </h2>
            <p className="mt-2">
              DronTest no se hace responsable de decisiones de estudio tomadas
              en base a su contenido. El usuario debe contrastar la normativa
              vigente directamente con las fuentes oficiales de AESA antes del
              examen.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
