import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  // --- Crear usuario admin ---
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@drontest.es" },
    update: {},
    create: {
      email: "admin@drontest.es",
      name: "Administrador",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Usuario admin creado: ${admin.email}`);

  // --- Crear categorías ---
  const catNormativo = await prisma.category.upsert({
    where: { name: "Concepto Normativo" },
    update: {},
    create: {
      name: "Concepto Normativo",
      description: "Legislación, reglamentos y normativa aplicable a la operación de drones en España.",
      order: 1,
    },
  });

  const catOperacional = await prisma.category.upsert({
    where: { name: "Procedimientos Operacionales" },
    update: {},
    create: {
      name: "Procedimientos Operacionales",
      description: "Procedimientos de vuelo, planificación, inspección y gestión de riesgos.",
      order: 2,
    },
  });

  const catMeteorologia = await prisma.category.upsert({
    where: { name: "Meteorología y Medio Ambiente" },
    update: {},
    create: {
      name: "Meteorología y Medio Ambiente",
      description: "Meteorología aeronáutica, efectos del viento, visibilidad y condiciones ambientales.",
      order: 3,
    },
  });

  console.log("✅ 3 categorías creadas");

  // --- Crear temas ---
  const topicNormativo1 = await prisma.topic.upsert({
    where: {
      categoryId_name: {
        categoryId: catNormativo.id,
        name: "Marco Legal",
      },
    },
    update: {},
    create: {
      name: "Marco Legal",
      description: "Categorías de operación, registro y aseguramiento.",
      categoryId: catNormativo.id,
      order: 1,
    },
  });

  const topicNormativo2 = await prisma.topic.upsert({
    where: {
      categoryId_name: {
        categoryId: catNormativo.id,
        name: "Limitaciones de Vuelo",
      },
    },
    update: {},
    create: {
      name: "Limitaciones de Vuelo",
      description: "Espacio aéreo, restricciones y autorizaciones.",
      categoryId: catNormativo.id,
      order: 2,
    },
  });

  const topicOperacional1 = await prisma.topic.upsert({
    where: {
      categoryId_name: {
        categoryId: catOperacional.id,
        name: "Planificación del Vuelo",
      },
    },
    update: {},
    create: {
      name: "Planificación del Vuelo",
      description: "Checklists, inspección pre-vuelo y gestión de riesgos.",
      categoryId: catOperacional.id,
      order: 1,
    },
  });

  const topicOperacional2 = await prisma.topic.upsert({
    where: {
      categoryId_name: {
        categoryId: catOperacional.id,
        name: "Operaciones Especiales",
      },
    },
    update: {},
    create: {
      name: "Operaciones Especiales",
      description: "Vuelo nocturno, transporte de mercancías y sobrevuelo de aglomeraciones.",
      categoryId: catOperacional.id,
      order: 2,
    },
  });

  const topicMeteo1 = await prisma.topic.upsert({
    where: {
      categoryId_name: {
        categoryId: catMeteorologia.id,
        name: "Meteorología Aeronáutica",
      },
    },
    update: {},
    create: {
      name: "Meteorología Aeronáutica",
      description: "Viento, visibilidad, nubes, precipitación y efectos en el vuelo.",
      categoryId: catMeteorologia.id,
      order: 1,
    },
  });

  const topicMeteo2 = await prisma.topic.upsert({
    where: {
      categoryId_name: {
        categoryId: catMeteorologia.id,
        name: "Contaminación Acústica",
      },
    },
    update: {},
    create: {
      name: "Contaminación Acústica",
      description: "Normativa de ruido, zonas sensibles y medidas de mitigación.",
      categoryId: catMeteorologia.id,
      order: 2,
    },
  });

  console.log("✅ 6 temas creados");

  // --- Crear preguntas ---

  // Categoría: Concepto Normativo - Marco Legal
  await prisma.question.create({
    data: {
      text: "¿En qué categoría de operación se encuadra un vuelo de un drone en el categoría 'abierta' que no suponga riesgo para personas en tierra?",
      topicId: topicNormativo1.id,
      categoryId: catNormativo.id,
      difficulty: "EASY",
      explanation: "Las operaciones en la categoría 'abierta' son aquellas que presentan un riesgo mínimo. Se subdividen en tres subcategorías (A1, A3 y A2) según el riesgo asociado. Un vuelo que no implique riesgo para personas en tierra se encuadra generalmente en la subcategoría A1.",
      reference: "Reglamento de Ejecución (UE) 2019/947, Art. 7",
      source: "Reglamento (UE) 2019/947",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Subcategoría A1", isCorrect: true, order: 1 },
          { text: "Subcategoría A2", isCorrect: false, order: 2 },
          { text: "Subcategoría A3", isCorrect: false, order: 3 },
          { text: "Categoría 'específica'", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Cuál es la masa máxima despegue (MTOM) límite para que un drone se considere de categoría C0 según la clasificación europea?",
      topicId: topicNormativo1.id,
      categoryId: catNormativo.id,
      difficulty: "EASY",
      explanation: "La clase C0 corresponde a drones con una MTOM de hasta 250 gramos. Es la clase más ligera y permite operaciones más flexibles dentro de la subcategoría A1.",
      reference: "Reglamento de Ejecución (UE) 2019/945, Anexo II",
      source: "Reglamento (UE) 2019/945",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "250 g", isCorrect: true, order: 1 },
          { text: "500 g", isCorrect: false, order: 2 },
          { text: "900 g", isCorrect: false, order: 3 },
          { text: "2 kg", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Es obligatorio asegurar un drone frente a responsabilidad civil en España?",
      topicId: topicNormativo1.id,
      categoryId: catNormativo.id,
      difficulty: "EASY",
      explanation: "Sí. El Reglamento (UE) 2019/947 establece la obligatoriedad de tener un seguro de responsabilidad civil para la operación de cualquier drone, salvo excepciones muy concretas para drones de masa inferior a 250 g que no tengan sensores ni cámara.",
      reference: "Reglamento (UE) 2019/947, Art. 16",
      source: "Reglamento (UE) 2019/947",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Sí, siempre es obligatorio", isCorrect: false, order: 1 },
          { text: "Solo si el drone pesa más de 900 g", isCorrect: false, order: 2 },
          { text: "Sí, salvo excepciones para drones < 250 g sin cámara/sensores", isCorrect: true, order: 3 },
          { text: "No, solo en operaciones comerciales", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  // Categoría: Concepto Normativo - Limitaciones de Vuelo
  await prisma.question.create({
    data: {
      text: "¿Cuál es la altura máxima de vuelo permitida en la categoría 'abierta' sin autorización específica?",
      topicId: topicNormativo2.id,
      categoryId: catNormativo.id,
      difficulty: "EASY",
      explanation: "En la categoría abierta, la altura máxima de vuelo sobre el punto más cercano de la superficie del drone es de 120 metros. Esta limitación es fundamental para no interferir con la aviación tripulada.",
      reference: "Reglamento de Ejecución (UE) 2019/947, Art. 6",
      source: "Reglamento (UE) 2019/947",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "50 metros", isCorrect: false, order: 1 },
          { text: "120 metros", isCorrect: true, order: 2 },
          { text: "150 metros", isCorrect: false, order: 3 },
          { text: "300 metros", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Se puede volar un drone sobre zonas urbanas en la categoría abierta?",
      topicId: topicNormativo2.id,
      categoryId: catNormativo.id,
      difficulty: "MEDIUM",
      explanation: "En la subcategoría A1, los vuelos sobre zonas pobladas, aglomeraciones de civiles o áreas industriales/comerciales están prohibidos. En A3, sí se permite sobrevolar zonas no pobladas, pero con restricciones. Las operaciones sobre personas no agrupadas requieren precaución adicional.",
      reference: "Reglamento de Ejecución (UE) 2019/947, Art. 7 y 9",
      source: "Reglamento (UE) 2019/947",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Sí, sin restricciones", isCorrect: false, order: 1 },
          { text: "No, está prohibido en todas las subcategorías", isCorrect: false, order: 2 },
          { text: "Solo en subcategoría A3 y con precaución, nunca sobre aglomeraciones", isCorrect: true, order: 3 },
          { text: "Solo con autorización de AENA", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  // Categoría: Procedimientos Operacionales - Planificación
  await prisma.question.create({
    data: {
      text: "¿Qué elemento es fundamental en la evaluación de riesgos antes de cada vuelo?",
      topicId: topicOperacional1.id,
      categoryId: catOperacional.id,
      difficulty: "MEDIUM",
      explanation: "La evaluación de riesgos es un proceso sistemático que identifica los peligros potenciales, evalúa su probabilidad y severidad, y establece medidas de mitigación. Es obligatoria en la categoría específica y recomendada en la abierta.",
      reference: "Norma UNE-EN 470-1:2018, Sección de evaluación de riesgos",
      source: "Norma UNE-EN 470-1:2018",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "La carga de la batería", isCorrect: false, order: 1 },
          { text: "La identificación de peligros y medidas de mitigación", isCorrect: true, order: 2 },
          { text: "El número de pilotos disponibles", isCorrect: false, order: 3 },
          { text: "La marca del drone", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Qué debe incluir la lista de verificación (checklist) pre-vuelo?",
      topicId: topicOperacional1.id,
      categoryId: catOperacional.id,
      difficulty: "EASY",
      explanation: "La checklist pre-vuelo debe incluir: estado físico del drone, estado de la batería, calibración de sensores, verificación de GPS, estado de las hélices, configuración del firmware, y comprobación de las condiciones meteorológicas y del espacio aéreo.",
      reference: "Norma UNE-EN 470-1:2018, checklist pre-vuelo",
      source: "Norma UNE-EN 470-1:2018",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Solo la carga de la batería", isCorrect: false, order: 1 },
          { text: "Estado físico, batería, sensores, hélices, GPS y condiciones", isCorrect: true, order: 2 },
          { text: "Solo la configuración del firmware", isCorrect: false, order: 3 },
          { text: "Solo la autorización de AENA", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  // Categoría: Procedimientos Operacionales - Operaciones Especiales
  await prisma.question.create({
    data: {
      text: "¿Qué se requiere para realizar un vuelo nocturno con un drone en la categoría abierta?",
      topicId: topicOperacional2.id,
      categoryId: catOperacional.id,
      difficulty: "MEDIUM",
      explanation: "Los vuelos nocturnos en la categoría abierta requieren que el drone esté equipado con luces de navegación que sean visibles al menos a 3 km de distancia y que el piloto pueda ver el drone a simple vista en todo momento. Además, puede requerirse una evaluación de riesgos adicional.",
      reference: "Reglamento de Ejecución (UE) 2019/947, Art. 14",
      source: "Reglamento (UE) 2019/947",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "No está permitido en la categoría abierta", isCorrect: false, order: 1 },
          { text: "Luces de navegación visibles a 3 km y visión directa del drone", isCorrect: true, order: 2 },
          { text: "Solo una autorización de AENA", isCorrect: false, order: 3 },
          { text: "Luces LED de cualquier intensidad", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Qué es un SORA y en qué contexto se utiliza?",
      topicId: topicOperacional2.id,
      categoryId: catOperacional.id,
      difficulty: "HARD",
      explanation: "SORA (Specific Operations Risk Assessment) es la metodología de evaluación de riesgos para operaciones específicas. Es el proceso central para obtener la autorización de la autoridad aeronáutica cuando se opera fuera de la categoría abierta, especialmente en las subcategorías de mayor riesgo.",
      reference: "EASA Easy Access Rules for UAS, Part-SORA",
      source: "EASA Easy Access Rules for UAS",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Un tipo de drone para operaciones especiales", isCorrect: false, order: 1 },
          { text: "Metodología de evaluación de riesgos para operaciones específicas", isCorrect: true, order: 2 },
          { text: "Un sistema de navegación GPS", isCorrect: false, order: 3 },
          { text: "Una licencia de piloto profesional", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  // Categoría: Meteorología y Medio Ambiente
  await prisma.question.create({
    data: {
      text: "¿Cuál es el efecto principal del viento fuerte sobre un drone durante el vuelo?",
      topicId: topicMeteo1.id,
      categoryId: catMeteorologia.id,
      difficulty: "EASY",
      explanation: "El viento fuerte afecta la estabilidad del drone, incrementa el consumo de batería (mayor potencia para mantener posición), puede causar deriva (drift) fuera de la ruta planificada y, en casos extremos, puede provocar la pérdida del control del drone.",
      reference: "Norma UNE-EN 470-1:2018, condiciones meteorológicas",
      source: "Norma UNE-EN 470-1:2018",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Mejora la autonomía del drone", isCorrect: false, order: 1 },
          { text: "Afecta la estabilidad, autonomía y control de la trayectoria", isCorrect: true, order: 2 },
          { text: "No tiene ningún efecto significativo", isCorrect: false, order: 3 },
          { text: "Solo afecta a la calidad de las imágenes", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Qué significa la abreviatura METAR en meteorología aeronáutica?",
      topicId: topicMeteo1.id,
      categoryId: catMeteorologia.id,
      difficulty: "MEDIUM",
      explanation: "METAR (Meteorological Aerodrome Report) es un informe meteorológico regular emitido para aeródromos. Contiene información sobre viento, visibilidad, nubes, temperatura, punto de rocío, presión y fenómenos meteorológicos significativos en el momento de la observación.",
      reference: "OMI (OACI) Anexo 3 - Meteorología aeronáutica",
      source: "OMI OACI Anexo 3",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Predicción meteorológica a 24 horas", isCorrect: false, order: 1 },
          { text: "Informe meteorológico de aeródromo en tiempo real", isCorrect: true, order: 2 },
          { text: "Alerta de tormentas severas", isCorrect: false, order: 3 },
          { text: "Informe de visibilidad mínima", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿A qué temperatura funcionan normalmente las baterías LiPo de drones?",
      topicId: topicMeteo1.id,
      categoryId: catMeteorologia.id,
      difficulty: "MEDIUM",
      explanation: "Las baterías LiPo funcionan de forma óptima entre 15 °C y 25 °C. Por debajo de 0 °C, su rendimiento se reduce significativamente (hasta un 30-40% menos de capacidad). Por encima de 45 °C, se produce degradación acelerada y riesgo de inflamación.",
      reference: "Norma UNE-EN 470-1:2018, condiciones ambientales",
      source: "Norma UNE-EN 470-1:2018",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Entre 0 °C y 10 °C", isCorrect: false, order: 1 },
          { text: "Entre 15 °C y 25 °C", isCorrect: true, order: 2 },
          { text: "Entre 30 °C y 40 °C", isCorrect: false, order: 3 },
          { text: "No tienen restricciones de temperatura", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  // Categoría: Contaminación Acústica
  await prisma.question.create({
    data: {
      text: "¿Qué zonas se consideran sensibles desde el punto de vista de la contaminación acústica?",
      topicId: topicMeteo2.id,
      categoryId: catMeteorologia.id,
      difficulty: "MEDIUM",
      explanation: "Las zonas sensibles acústicamente incluyen hospitales, centros educativos, residencias de ancianos, parques naturales y áreas residenciales densamente pobladas. La operación de drones cerca de estas zonas puede requerir medidas de mitigación adicionales.",
      reference: "Real Decreto 1367/2007, evaluación y gestión de la contaminación acústica",
      source: "Real Decreto 1367/2007",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Solo las zonas industriales", isCorrect: false, order: 1 },
          { text: "Hospitales, escuelas, zonas residenciales y parques naturales", isCorrect: true, order: 2 },
          { text: "Solo los aeropuertos", isCorrect: false, order: 3 },
          { text: "Ninguna zona es considerada sensible", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  await prisma.question.create({
    data: {
      text: "¿Cuál es la principal medida de mitigación de ruido en operaciones de drones?",
      topicId: topicMeteo2.id,
      categoryId: catMeteorologia.id,
      difficulty: "HARD",
      explanation: "Las principales medidas incluyen: mantener alturas de vuelo que reduzcan el impacto acústico, utilizar drones con motores y hélices de bajo ruido, evitar operaciones en horas de descanso (noche y madrugada), y planificar rutas que eviten zonas sensibles.",
      reference: "Real Decreto 1367/2007, medidas de mitigación",
      source: "Real Decreto 1367/2007",
      status: "PUBLISHED",
      options: {
        create: [
          { text: "Volar siempre a máxima altura", isCorrect: false, order: 1 },
          { text: "Usar drones más grandes y potentes", isCorrect: false, order: 2 },
          { text: "Altura adecuada, equipamiento de bajo ruido y planificación de rutas", isCorrect: true, order: 3 },
          { text: "No hay medidas de mitigación para drones", isCorrect: false, order: 4 },
        ],
      },
    },
  });

  console.log("✅ 15 preguntas creadas");

  // --- Crear ExamConfig de ejemplo ---
  await prisma.examConfig.create({
    data: {
      name: "Simulacro Concepto Normativo",
      description: "Simulacro de examen sobre conceptos normativos de la categoría abierta.",
      categoryId: catNormativo.id,
      // Coincide con el nº de preguntas disponibles en el seed (5)
      questionCount: 5,
      duration: 90,
      passingScore: 0.5,
      isActive: true,
    },
  });

  console.log("✅ ExamConfig de ejemplo creado");

  console.log("🎉 Seed completado correctamente.");
}

main()
  .catch((e) => {
    console.error("❌ Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => await prisma.$disconnect());
