# Banco de preguntas A1/A3 — temario oficial AESA

Este directorio contiene el banco de preguntas activo de DronTest. Se genera
íntegramente a partir del temario oficial del curso **UAS-Certificación A1/A3**
de AESA, disponible localmente en `docs/temario-a1a3/` (texto) y enlazado
completo en `docs/Certificacion-A1A3/` (material original con imágenes).

> Las preguntas son **elaboradas a partir de material público de formación de
> AESA**; no son preguntas oficiales del examen de AESA ni una filtración del
> mismo. Cada pregunta conserva la referencia a la diapositiva que la respalda.

## Fuente

| Parte | Documento | Diapositivas |
|---|---|---|
| Parte 1 — Concepto normativo | FOR-UAS-P01-DT01, Ed. 09, julio 2024 | 55 |
| Parte 2 — Conocimientos generales | Lección 2 del curso A1/A3 | 85 |
| Parte 3 — Procedimientos operacionales | Versión 4, noviembre 2022 | 21 |

Los textos de origen están en `docs/temario-a1a3/PARTE{1,2,3}/conceptos/`
(un `.md` por diapositiva) y sus índices en `md_index.md`.

## Ficheros y recuento

| Fichero | Categoría | Temas | Preguntas |
|---|---|---|---|
| `preguntas-parte1.json` | Parte 1 — Concepto normativo | 6 | 91 |
| `preguntas-parte2.json` | Parte 2 — Conocimientos generales | 14 | 141 |
| `preguntas-parte3.json` | Parte 3 — Procedimientos operacionales | 4 | 48 |
| **Total** | **3 categorías** | **24 temas** | **280** |

### Parte 1 — Concepto normativo (91)

| Tema | Preguntas |
|---|---|
| Conceptos básicos | 11 |
| Definiciones operativas | 16 |
| Contexto histórico y marco normativo | 10 |
| Categorías de operación y clases de UAS | 32 |
| Categoría específica y certificada | 8 |
| Edades, registro y responsabilidades | 14 |

### Parte 2 — Conocimientos generales (141)

| Tema | Preguntas |
|---|---|
| Principios de vuelo y aerodinámica | 12 |
| Factores ambientales y atmósfera | 8 |
| Componentes del UAS | 8 |
| Mando y control | 10 |
| Comunicaciones | 7 |
| Sensores e instrumentos de vuelo | 11 |
| Limitaciones, información y mantenimiento | 8 |
| Espacio aéreo | 14 |
| Zonas geográficas UAS | 12 |
| Notificación de sucesos y U-space | 13 |
| Factores humanos y percepción | 11 |
| Privacidad y protección de datos | 8 |
| Seguridad física y baterías | 9 |
| Seguros, accidentes e incidentes | 10 |

### Parte 3 — Procedimientos operacionales (48)

| Tema | Preguntas |
|---|---|
| Procedimientos previos al vuelo | 18 |
| Procedimientos durante el vuelo | 8 |
| Contingencias y emergencias | 14 |
| Procedimientos posteriores al vuelo | 8 |

## Formato de los JSON

Cada fichero describe una categoría completa:

```json
{
  "categoria": "Parte 1 — Concepto normativo",
  "descripcion": "…",
  "fuente": "AESA — Curso UAS A1/A3. Parte 1 …",
  "temas": [
    {
      "nombre": "Conceptos básicos",
      "descripcion": "…",
      "preguntas": [
        {
          "dificultad": "EASY",
          "pregunta": "¿…?",
          "opciones": ["…", "…", "…", "…"],
          "correcta": 1,
          "explicacion": "…",
          "referencia": "Parte 1, diapositiva 4 — …"
        }
      ]
    }
  ]
}
```

Reglas que se validan antes de cargar:

- Exactamente **4 opciones** por pregunta, todas distintas.
- `correcta` es un índice 0–3 y hay **una sola** respuesta correcta.
- `dificultad` es `EASY`, `MEDIUM` o `HARD`.
- `explicacion` y `referencia` no están vacías.

La posición de la respuesta correcta se distribuyó de forma equilibrada entre
A, B, C y D (72 / 58 / 76 / 74) mediante una mezcla determinista, para evitar
que el patrón de respuestas sea predecible.

## Carga en base de datos

`prisma/seed.ts` importa los tres JSON y:

1. Crea o conserva el usuario administrador de desarrollo.
2. Vacía el contenido didáctico anterior (`attemptAnswer`, `examAttempt`,
   `favorite`, `answerOption`, `question`, `examConfig`, `topic`, `category`).
   **Los usuarios se conservan.**
3. Crea las 3 categorías, sus 24 temas y las 280 preguntas publicadas.
4. Crea las configuraciones de examen:
   - **Simulacro oficial A1/A3**: 40 preguntas, 40 minutos, 75 % de aciertos.
   - **Práctica Parte 1**: 25 preguntas, 30 minutos.
   - **Práctica Parte 2**: 25 preguntas, 30 minutos.
   - **Práctica Parte 3**: 20 preguntas, 25 minutos.

```bash
npm run db:seed
```

> El seed es **destructivo** con el contenido: borra preguntas, intentos y
> favoritos existentes. Haz una copia de seguridad antes de ejecutarlo en un
> entorno con datos que quieras conservar.

## Cómo actualizar el banco

1. Edita el JSON correspondiente respetando el formato y las reglas anteriores.
2. Comprueba la estructura (4 opciones, un único índice correcto).
3. Ejecuta `npm run db:seed` y verifica los recuentos.
4. Si cambia una pregunta ya usada en un intento, ten en cuenta que los
   intentos guardan su propia instantánea; no se reescriben históricos.
