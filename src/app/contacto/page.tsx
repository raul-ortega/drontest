import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto — DronTest",
  description: "Canal de contacto con el equipo de DronTest.",
};

export default function ContactoPage() {
  return (
    <main className="flex-1 bg-slate-950">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-400">
          {"// Contacto"}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
          Contacto
        </h1>

        <div className="mt-8 space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white">
              ¿Necesitas ayuda?
            </h2>
            <p className="mt-2">
              Para dudas sobre tu cuenta, incidencias técnicas o ejercicios de
              privacidad, escríbenos a:
            </p>
            <p className="mt-2 font-mono text-cyan-400">
              contacto@drontest.es
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              Sugerencias y errores de contenido
            </h2>
            <p className="mt-2">
              Si detectas un error en alguna pregunta o crees que falta algún
              tema, agradecemos que nos lo comuniques por el mismo canal
              indicando la pregunta o el tema afectado.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              No afiliación con AESA
            </h2>
            <p className="mt-2">
              DronTest no mantiene relación institucional con AESA. Para
              trámites oficiales (inscripciones, exámenes, certificados)
              consulta directamente la web oficial de AESA.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
