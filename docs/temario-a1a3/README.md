# Temario AESA A1/A3 — material de consulta

Esta carpeta reúne el contenido teórico del curso **UAS-Certificación A1/A3** de
AESA en formato Markdown. El texto se ha dividido diapositiva a diapositiva para
poder consultarlo con comodidad y sirve de base documental para las preguntas de
`prisma/data/`. No se incluyen los elementos gráficos ni los documentos
originales.

## El curso en breve

El curso está pensado para quienes pilotan UAS dentro de la categoría abierta,
en las subcategorías A1 y A3. Su finalidad es dar a conocer los requisitos y las
buenas prácticas necesarias para volar sin poner en riesgo a personas, bienes o
otras aeronaves.

La formación y el examen son obligatorios para utilizar:

- UAS con marcado de clase C1, C2, C3 o C4;
- UAS de construcción propia;
- UAS comercializados antes del 1 de enero de 2024 con un peso máximo al
  despegue inferior a 25 kg, cuando se opere en la subcategoría A3.

AESA comunica el resultado en un plazo aproximado de 72 horas mediante la
«Prueba de superación de la formación en línea». Con ella se puede operar en
A1/A3 en cualquier Estado miembro de EASA. El acceso al curso en la plataforma
tiene una vigencia de 30 días desde que se reciben las credenciales.

## Cómo se organiza el curso

La plataforma de AESA estructura el curso en varios bloques:

1. Presentación de las pruebas de superación.
2. Aceptación de las condiciones del curso y del examen.
3. Parte 1 — Concepto normativo.
4. Parte 2 — Conocimientos generales.
5. Parte 3 — Procedimientos operacionales.
6. Examen teórico A1/A3.

### Parte 1 — Concepto normativo

Se centra en el vocabulario y el marco legal: definiciones básicas, evolución
histórica de los UAS y reglamentos europeos aplicables (2019/947 y 2019/945).
También explica las categorías y subcategorías de operación, la edad mínima y la
formación exigida, el registro de operadores y las obligaciones del piloto.

Primera diapositiva: [Portada de la Parte 1](PARTE1/conceptos/Diapositiva1.md).

### Parte 2 — Conocimientos generales

Aborda el vuelo desde un punto de vista técnico y operativo: principios de
aerodinámica y fuerzas que afectan a la aeronave; sistemas de mando y control,
comunicaciones, sensores, instrumentación y mantenimiento; estructura del
espacio aéreo y zonas geográficas de UAS; factores humanos; privacidad y
protección de datos; manipulación segura de la aeronave y las baterías;
prevención de interferencias ilícitas; seguros y notificación de accidentes e
incidentes.

Primera diapositiva: [Contenido 1 — Principios de vuelo](PARTE2/conceptos/Diapositiva1.md).

### Parte 3 — Procedimientos operacionales

Reúne las rutinas que el piloto debe seguir antes del despegue, durante el vuelo
y una vez finalizada la operación.

Primera diapositiva: [Portada de la Parte 3](PARTE3/conceptos/Diapositiva1.md).

## El examen A1/A3

El examen (`UAS-A1/A3-Q002`) consta de 40 preguntas de opción múltiple con
cuatro respuestas posibles y una sola válida. Cada pregunta vale lo mismo y los
fallos no restan puntos. Se aprueba con al menos el 75 % del total.

Se realiza en línea y no es compatible con Safari. Hay dos convocatorias: si se
supera la primera, no debe realizarse la segunda. La calificación que cuenta es
la última obtenida, de modo que suspender el segundo intento supone un resultado
de «no apto».

Tras aprobar, la resolución se notifica en la Sede Electrónica de AESA en unas
72 horas, siempre que se haya aceptado la notificación de matriculación.

## Contenido de esta carpeta

| Carpeta | Parte | Diapositivas | Documento de origen |
|---|---|---|---|
| `PARTE1/` | Concepto normativo | 55 | FOR-UAS-P01-DT01, Ed. 09 (julio 2024) |
| `PARTE2/` | Conocimientos generales | 85 | Lección 2 del curso |
| `PARTE3/` | Procedimientos operacionales | 21 | Versión 4 (noviembre 2022) |

En cada parte:

- `conceptos/DiapositivaN.md`: texto de una diapositiva concreta.
- `md_index.md`: relación entre diapositiva, archivo y título.
- `README.md`: esta guía.

## Procedencia y uso

El texto procede de la plataforma de formación de AESA:

- <https://sede.seguridadaerea.gob.es/formacion/>
- <https://sede.seguridadaerea.gob.es/formacion/course/view.php?id=6>

En el repositorio se guarda únicamente el texto (aproximadamente 700 KB). Las
imágenes, los PDF y los volcados HTML no se distribuyen. En el equipo de
desarrollo, el material completo está enlazado en `docs/Certificacion-A1A3`,
ruta excluida de Git.

Las preguntas de `prisma/data/preguntas-parte{1,2,3}.json` indican en su campo
`referencia` la parte y la diapositiva de las que proceden. Para revisar una
pregunta basta con abrir el Markdown correspondiente.

## Aviso

El contenido original pertenece a AESA y se utiliza aquí como documentación
pública de formación. Las preguntas del banco son de elaboración propia y no
deben presentarse como preguntas oficiales del examen.

## Contacto

- Correo: formaciondrones.aesa@seguridadaerea.es
- Web: <https://sede.seguridadaerea.gob.es/formacion/>
