import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidad — DronTest",
  description:
    "Información sobre el tratamiento de datos personales en DronTest.",
};

export default function PrivacidadPage() {
  return (
    <main className="flex-1 bg-slate-950">
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <p className="font-mono text-sm uppercase tracking-[0.25em] text-cyan-400">
          {"// Privacidad"}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-white">
          Política de privacidad
        </h1>

        <div className="mt-8 space-y-6 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-white">1. Datos que tratamos</h2>
            <p className="mt-2">
              DronTest trata únicamente los datos necesarios para el
              funcionamiento de la plataforma: nombre, dirección de correo
              electrónico y contraseña (cifrada). No se recogen datos de
              localización ni datos sensibles.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              2. Finalidad del tratamiento
            </h2>
            <p className="mt-2">
              Los datos se utilizan para: identificar al usuario en sus
              sesiones, guardar su historial de exámenes, favoritos y
              estadísticas de progreso, y mejorar la calidad del servicio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              3. Base legal y derechos
            </h2>
            <p className="mt-2">
              El tratamiento se basa en el consentimiento del usuario al
              crear su cuenta. Puedes ejercer tus derechos de acceso,
              rectificación, supresión, oposición, limitación y portabilidad
              escribiendo a la dirección de contacto indicada en la página de
              contacto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              4. Conservación y seguridad
            </h2>
            <p className="mt-2">
              Los datos se conservan mientras la cuenta esté activa. Las
              contraseñas se almacenan cifradas con bcrypt y las comunicaciones
              se realizan por HTTPS.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-white">
              5. No afiliación con AESA
            </h2>
            <p className="mt-2">
              DronTest es una plataforma independiente de práctica. No es una
              aplicación oficial, certificada ni avalada por AESA, y no
              mantiene ninguna relación institucional con dicho organismo.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
