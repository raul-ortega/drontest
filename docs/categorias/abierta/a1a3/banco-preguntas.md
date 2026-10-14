# Banco de Preguntas — Pool Completo de Exámenes (UAS)

> **Objetivo:** Pool de preguntas para generar simulacros de 40 preguntas aleatorias.
> **Fuente:** `docs/_Formacion.temario.completo.Ed12.pdf` → FOR-UAS-P01-DT01_Ed.09, Versión 9 (Julio 2024)
> **Estado:** 95 preguntas verificadas e insertadas en BD (4 duplicados eliminados).
> **Nota:** Contaminación Acústica solo tiene 1 página (pág. 36) con contenido relevante. El resto de temas tienen abundante contenido.

---

## Distribución por tema

| # | Categoría | Tema | Preguntas |
|---|-----------|------|-----------|
| 1 | Concepto Normativo | Marco Legal | 20 |
| 2 | Concepto Normativo | Limitaciones de Vuelo | 20 |
| 3 | Meteorología y Medio Ambiente | Meteorología Aeronáutica | 17 |
| 4 | Meteorología y Medio Ambiente | Contaminación Acústica | 2 |
| 5 | Procedimientos Operacionales | Planificación del Vuelo | 20 |
| 6 | Procedimientos Operacionales | Operaciones Especiales | 15 |
| | **Total** | | **94** |

---

## Progreso global

- [x] **40 preguntas iniciales** verificadas e insertadas en BD
- [x] **Grupo A:** Marco Legal → 20 preguntas (Q001–Q020)
- [x] **Grupo B:** Limitaciones de Vuelo → 20 preguntas (Q021–Q040)
- [x] **Grupo C:** Meteorología Aeronáutica → 17 preguntas (Q041–Q057)
- [x] **Grupo D:** Contaminación Acústica → 2 preguntas (Q061–Q062)
- [x] **Grupo E:** Planificación del Vuelo → 20 preguntas (Q065–Q084)
- [x] **Grupo F:** Operaciones Especiales → 15 preguntas (Q085–Q099)

---

## Formato de cada pregunta

Cada pregunta se genera con este formato:

```markdown
### Q0XX — [Enunciado]

**Opciones:**
- A) [texto]
- B) [texto]
- C) [texto]
- D) [texto]

**Correcta:** [A/B/C/D]

**Explicación:** [breve explicación]

**Fuente:** [cita literal del PDF] — FOR-UAS-P01-DT01_Ed.09, pág. NN.

**Dificultad:** EASY | MEDIUM | HARD

**Estado:** [x] Verificada | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD | [x] Insertada en BD
```

---

## Proceso de trabajo (por grupo)

1. **Buscar** en el PDF la página/subtema correspondiente.
2. **Redactar** el enunciado con 4 opciones (A-D), una correcta.
3. **Verificar** la respuesta contra la cita literal del PDF.
4. **Marcar** `[x] Verificada` cuando la fuente confirme la respuesta.
5. **Insertar** en BD con `prisma/seed-questions-batch.ts` (script incremental).
6. **Marcar** `[x] Insertada en BD`.

> **Nota:** Las respuestas correctas se distribuyen en posiciones variadas (A, B, C, D) para evitar patrones predecibles.

---

## Grupo A — Marco Legal (20 preguntas, Q001–Q020)

> **Rango de páginas:** 4–55 | **Temas:** definiciones, reglamentos, categorías, clases, edades, responsabilidades

### Q001 — Significado y alcance de la sigla UAS

**Opciones:**
- A) Unmanned aircraft: la aeronave sola, sin incluir el equipo de control remoto.
- B) Remote Pilot Aircraft System: el sistema centrado en el piloto remoto.
- C) Unmanned aircraft system: la aeronave no tripulada y el equipo para controlarla de forma remota.
- D) Drone: término coloquial para referirse a cualquier aeronave no tripulada.

**Correcta:** C

**Explicación:** UAS significa «Unmanned aircraft system» (sistema de aeronave no tripulada) e incluye tanto la aeronave como el equipo para controlarla de forma remota. El término UAS engloba también los RPAS y las aeronaves autónomas.

**Fuente:** «UAS «Sistema de aeronave no tripulada»: Aeronave no tripulada y el equipo para controlarla de forma remota. El término UAS engloba los RPAS y las aeronaves autónomas.» — FOR-UAS-P01-DT01_Ed.09, pág. 4.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q002 — Reglamento que define las tres categorías de operación

**Opciones:**
- A) Reglamento Delegado (UE) 2019/945.
- B) Reglamento de Ejecución (UE) 2019/947.
- C) Real Decreto 517/2024.
- D) Ley 18/2014.

**Correcta:** B

**Explicación:** El Reglamento de Ejecución (UE) 2019/947 define las tres categorías de operación con UAS: «abierta», «específica» y «certificada».

**Fuente:** «El Reglamento de Ejecución (UE) 2019/947 define tres categorías de operación con UAS: «abierta», «específica» y «certificada».» — FOR-UAS-P01-DT01_Ed.09, pág. 17.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q003 — Reglamento de requisitos de diseño y fabricación de UAS

**Opciones:**
- A) Ley 18/2014.
- B) Reglamento de Ejecución (UE) 2019/947.
- C) Real Decreto 1036/2017.
- D) Reglamento Delegado (UE) 2019/945.

**Correcta:** D

**Explicación:** El Reglamento Delegado (UE) 2019/945 establece los requisitos para el diseño y fabricación de UAS, incluyendo la definición de requisitos para UAS de clase C0, C1, C2, C3 y C4.

**Fuente:** «Reglamento Delegado (UE) 2019/945: Define requisitos para UAS de clase C0, C1, C2, C3 y C4.» — FOR-UAS-P01-DT01_Ed.09, pág. 10.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q004 — Real Decreto 517/2024: entrada en vigor y derogación

**Opciones:**
- A) Real Decreto 517/2024.
- B) Reglamento de Ejecución (UE) 2019/947.
- C) Reglamento Delegado (UE) 2019/945.
- D) Ley 18/2014.

**Correcta:** A

**Explicación:** El Real Decreto 517/2024 entró en vigor el 25 de junio de 2024, estableciendo el régimen jurídico para la utilización civil de UAS y derogando el Real Decreto 1036/2017.

**Fuente:** «El 25 de junio de 2024 entra en vigor el Real Decreto 517/2024, por el cual se desarrolla el régimen jurídico para la utilización civil de sistemas de aeronaves no tripuladas (UAS), y se deroga el Real Decreto 1036/2017.» — FOR-UAS-P01-DT01_Ed.09, pág. 8.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q005 — Altura máxima en categoría abierta

**Opciones:**
- A) 150 m.
- B) 60 m.
- C) 120 m.
- D) 400 m.

**Correcta:** C

**Explicación:** La altura máxima en categoría «abierta» es de 120 m del punto más próximo de la superficie (equivalente a 400 ft). La aviación general tiene su límite inferior en 150 m, dejando solo 30 m de separación.

**Fuente:** «No se permite el vuelo a una altura superior a 120 m del punto mas próximo de la superficie. La altura de 120 m sobre el terreno (con su excepción), no debe ser superada ya que el límite inferior de la aviación general es de 150 m.» — FOR-UAS-P01-DT01_Ed.09, pág. 19.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q006 — Distancias en subcategoría A2

**Opciones:**
- A) 150 m.
- B) 30 m, reducible a 5 m con modo de baja velocidad.
- C) 5 m siempre.
- D) No hay distancia mínima.

**Correcta:** B

**Explicación:** En A2 se permite el vuelo a una distancia horizontal segura de al menos 30 m de personas no participantes, que podrá reducirse hasta un mínimo de 5 m cuando se active la función de modo de baja velocidad (regla 1:1).

**Fuente:** «Se permite el vuelo a una distancia horizontal segura de al menos 30 m de personas no participantes, que podrá reducirse hasta un mínimo de 5 m cuando se active la función de modo de baja velocidad.» — FOR-UAS-P01-DT01_Ed.09, pág. 29.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q007 — Distancias en subcategoría A3

**Opciones:**
- A) 30 m.
- B) 120 m.
- C) 100 m.
- D) 150 m.

**Correcta:** D

**Explicación:** En A3 se debe volar a una distancia horizontal segura mínima de 150 m de zonas residenciales, comerciales, industriales y recreativas.

**Fuente:** «Volar a una distancia horizontal segura mínima de 150 m de zonas residenciales, comerciales, industriales y recreativas.» — FOR-UAS-P01-DT01_Ed.09, pág. 32.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q008 — Edad mínima para operadores de UAS

**Opciones:**
- A) 16 años.
- B) 14 años.
- C) 18 años.
- D) 12 años.

**Correcta:** A

**Explicación:** La edad mínima exigible a los operadores de UAS que quieran darse de alta en el registro para volar en España es de 16 años.

**Fuente:** «La edad mínima exigible a los operadores de UAS que quieran darse de alta en el registro para volar en España es de 16 años.» — FOR-UAS-P01-DT01_Ed.09, pág. 44.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q009 — Obligación de registro como operador de UAS

**Opciones:**
- A) Siempre, independientemente de la masa del UAS.
- B) Solo si el UAS pesa más de 500 g.
- C) Si el UAS tiene MTOM > 250 g o está equipado con un sensor capaz de captar datos personales (cámaras, micrófonos).
- D) Solo si se vuela en entorno urbano.

**Correcta:** C

**Explicación:** En categoría «abierta» es obligatorio registrarse si el UAS tiene MTOM superior a 250 g o si está equipado con un sensor capaz de captar datos personales (cámaras, micrófonos). En categoría «específica», siempre es obligatorio independientemente del UAS.

**Fuente:** «Un operador de UAS debe registrarse siempre que: Operen en categoría «abierta» con cualquier UAS que tenga una MTOM superior a 250 g; o esté equipado con un sensor capaz de captar datos personales (cámaras, micrófonos).» — FOR-UAS-P01-DT01_Ed.09, pág. 47.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q010 — Significado de VLOS

**Opciones:**
- A) Operación realizada mediante visión en primera persona (FPV).
- B) Operación en la que el piloto a distancia puede mantener un contacto visual continuo con la aeronave sin la ayuda de instrumentos.
- C) Operación más allá del alcance visual del piloto.
- D) Operación realizada a una altura visualmente limitada.

**Correcta:** B

**Explicación:** VLOS (Visual line of sight) significa que el piloto a distancia puede mantener un contacto visual continuo con la aeronave sin la ayuda de instrumentos, controlando la trayectoria para evitar colisiones.

**Fuente:** «Operación dentro del alcance visual «VLOS»: Aquellas operaciones con UAS en las que piloto a distancia puede mantener un contacto visual continuo con la aeronave sin la ayuda de instrumentos, y puede controlar la trayectoria de la nave con el fin de evitar colisiones con otras aeronaves, personas y obstáculos.» — FOR-UAS-P01-DT01_Ed.09, pág. 14.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q011 — Edad mínima para operar UAS clase C1 en A1

**Opciones:**
- A) 12 años.
- B) 16 años.
- C) 14 años para A2, pero 16 para A1.
- D) 14 años.

**Correcta:** D

**Explicación:** El artículo 7 del Real Decreto 517/2024 establece que la edad mínima se reduce a 14 años cuando se opera en subcategoría A1 con un UAS de clase C1.

**Fuente:** «A 14 años en cualquiera de los siguientes supuestos: Cuando operen en subcategoría A1 con un UAS de clase C1.» — FOR-UAS-P01-DT01_Ed.09, pág. 45.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q012 — Masa máxima de UAS clase C0

**Opciones:**
- A) Menor de 250 g.
- B) Menor de 900 g.
- C) Menor de 4 kg.
- D) Menor de 25 kg.

**Correcta:** A

**Explicación:** Los UAS de clase C0 tienen una MTOM menor de 250 g, velocidad máxima inferior a 19 m/s, y deben ser eléctricos.

**Fuente:** «Tener etiqueta de identificación de clase C0, lo que implica cumplir con los siguientes requisitos: < 250 g, < 19 m/s, Eléctrico.» — FOR-UAS-P01-DT01_Ed.09, pág. 27.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q013 — Masa máxima de UAS clase C2

**Opciones:**
- A) Menor de 250 g.
- B) Menor de 900 g.
- C) Menor de 4 kg.
- D) Menor de 25 kg.

**Correcta:** C

**Explicación:** Los UAS de clase C2 tienen una MTOM menor de 4 kg, función de baja velocidad (límite v < 3 m/s), altura máxima de vuelo limitada a 120 m, y enlace de datos protegido.

**Fuente:** «Los vuelos en la subcategoría A2 de la categoría «abierta» se podrán realizar con los UAS que tengan etiqueta de identificación de clase C2 y deben cumplir los siguientes requisitos: < 4 kg, Función baja velocidad (límite v < 3 m/s).» — FOR-UAS-P01-DT01_Ed.09, pág. 31.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q014 — Piloto a distancia vs Operador de UAS

**Opciones:**
- A) Son el mismo rol: la persona que controla el UAS.
- B) El piloto a distancia controla la aeronave; el operador es la persona o organización responsable de la operación.
- C) El operador controla la aeronave; el piloto a distancia es el responsable legal.
- D) El piloto a distancia es siempre el propietario del UAS.

**Correcta:** B

**Explicación:** El piloto a distancia es la persona que pilota el UAS durante el vuelo. El operador es la persona o organización responsable de la operación, pudiendo ser la misma persona o diferentes.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 6.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q015 — Funciones de EASA

**Opciones:**
- A) EASA es la agencia española que regula los drones en España.
- B) EASA es la Agencia Europea de Seguridad Aérea, con competencias a nivel europeo.
- C) EASA se encarga exclusivamente de la formación de pilotos.
- D) EASA solo regula la aviación comercial tripulada.

**Correcta:** B

**Explicación:** EASA (European Union Aviation Safety Agency) es la Agencia Europea de Seguridad Aérea, con competencias a nivel europeo en materia de seguridad aérea. AESA es la agencia española equivalente.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 7.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q016 — Funciones de AESA

**Opciones:**
- A) AESA es la agencia europea de seguridad aérea.
- B) AESA es la Agencia Estatal de Seguridad Aérea de España, con competencias nacionales.
- C) AESA solo se encarga de la inspección de aeródromos.
- D) AESA regula exclusivamente la aviación militar.

**Correcta:** B

**Explicación:** AESA (Agencia Estatal de Seguridad Aérea) es el organismo español competente en materia de seguridad aérea, con competencias a nivel nacional.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 7.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q017 — Registro del operador: dónde darse de alta

**Opciones:**
- A) En la sede física de AESA en Madrid.
- B) En la página web de EASA exclusivamente.
- C) En el Registro Estatal de Operadores de UAS, a través de la sede electrónica de AESA.
- D) No es necesario registrarse, solo inscribir el UAS.

**Correcta:** C

**Explicación:** El operador debe darse de alta en el Registro Estatal de Operadores de UAS, a través de la sede electrónica de AESA. Se obtiene un código de operador que debe identificarse en el UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 47-48.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q018 — Código de operador: obligación de identificación

**Opciones:**
- A) Solo debe identificarse en la batería del UAS.
- B) Debe identificarse en el mando de control.
- C) Debe identificarse de forma visible en el propio UAS.
- D) No es necesario identificar el código de operador.

**Correcta:** C

**Explicación:** El código de operador obtenido del registro debe identificarse de forma visible en el propio UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 48.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q019 — Responsabilidades del operador en categoría abierta

**Opciones:**
- A) Solo es responsable de mantener el UAS en perfecto estado.
- B) Verificar que la operación se realiza conforme a la normativa, asegurar que el piloto tiene la formación necesaria y asegurar el UAS.
- C) Solo es responsable de la formación del piloto.
- D) Solo es responsable de obtener el seguro del UAS.

**Correcta:** B

**Explicación:** El operador en categoría abierta debe: verificar que la operación se realiza conforme a la normativa, asegurar que el piloto a distancia tiene la formación adecuada, y asegurar el UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 49.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q020 — Responsabilidades del piloto en categoría abierta

**Opciones:**
- A) Solo debe volar dentro de la altura máxima permitida.
- B) Seguir las instrucciones del fabricante, verificar que el UAS es apto para el vuelo y respetar las limitaciones de la categoría.
- C) Solo debe respetar las distancias de seguridad.
- D) Solo debe informar a AESA antes de cada vuelo.

**Correcta:** B

**Explicación:** El piloto a distancia debe: seguir las instrucciones del fabricante, verificar que el UAS es apto para el vuelo, y respetar las limitaciones de la categoría en la que opera.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 50.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

## Grupo B — Limitaciones de Vuelo (20 preguntas, Q021–Q040)

> **Rango de páginas:** 14–35, 44–50, 91–124 | **Temas:** altitud, distancias, VLOS/BVLOS, espacio aéreo, zonas, coordinación aeródromos, factores humanos, privacidad

### Q021 — Excepción altura máxima: vuelo sobre obstáculos

**Opciones:**
- A) Se permite volar a 150m si hay un obstáculo de menos de 30m.
- B) Se permite volar a menos de 50 m horizontalmente de un obstáculo artificial de más de 105 m de altura, incrementando la altura máxima hasta 15 m por encima del obstáculo a petición de la entidad responsable.
- C) Se permite volar a cualquier altura si se mantiene VLOS.
- D) Se permite volar a 200m en zonas rurales.

**Correcta:** B

**Explicación:** La aeronave no se alejará más de 120 metros del punto más próximo de la superficie, salvo cuando se sobrevuele sobre un obstáculo. Si una aeronave no tripulada vuela a menos de 50 m (horizontalmente) de un obstáculo artificial de más de 105 m de altura, la altura máxima podrá incrementarse hasta 15 m por encima de la altura del obstáculo a petición de la entidad responsable del obstáculo.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 19, 91.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q022 — Separación con aviación tripulada

**Opciones:**
- A) No se requiere separación alguna.
- B) Se debe mantener una separación vertical de al menos 30 m con la aviación general, cuyo límite inferior es de 150 m.
- C) Se debe volar siempre por debajo de los 50 m.
- D) Se debe informar al control de tráfico aéreo antes de cada vuelo.

**Correcta:** B

**Explicación:** La aviación general tiene su límite inferior en 150 m, dejando solo 30 m de separación con los UAS que vuelan a máximo 120 m.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 19.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q023 — Prohibición de sobrevuelo de concentraciones de personas

**Opciones:**
- A) Se permite sobrevolar concentraciones de personas con UAS de clase C0.
- B) En ninguna subcategoría de la categoría «abierta» se permite el sobrevuelo de concentraciones de personas.
- C) Se permite con menos de 100 personas.
- D) Se permite si el UAS tiene un paracaídas.

**Correcta:** B

**Explicación:** En ninguna subcategoría de la categoría «abierta» se permite el sobrevuelo de concentraciones de personas, definidas como reuniones donde las personas no pueden evitar el impacto de un UAS en caída libre.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 21, 25, 29, 32.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q024 — Prohibición de transporte de mercancías peligrosas

**Opciones:**
- A) Se permite con cualquier UAS si las mercancías son de bajo riesgo.
- B) En categoría «abierta» está prohibido el transporte de mercancías peligrosas.
- C) Se permite si el UAS es de clase C1 o superior.
- D) Se permite si el piloto tiene formación específica.

**Correcta:** B

**Explicación:** En categoría «abierta» está prohibido el vuelo con el fin de transportar mercancías peligrosas.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 23.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q025 — Conflicto con aeronave tripulada: prioridad

**Opciones:**
- A) El UAS tiene prioridad sobre la aeronave tripulada.
- B) La aeronave tripulada tiene siempre prioridad; el UAS debe maniobrar para evitarla.
- C) Ambos deben mantener su trayectoria.
- D) El piloto debe comunicarse con el control de tráfico aéreo antes de maniobrar.

**Correcta:** B

**Explicación:** En caso de conflicto con una aeronave tripulada, esta tiene siempre prioridad. El piloto del UAS debe realizar maniobras evasivas para evitarla.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 20.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q026 — Rol del observador de la aeronave

**Opciones:**
- A) El observador pilota el UAS a distancia.
- B) El observador ayuda al piloto a mantener el contacto visual con la aeronave y a efectuar el vuelo de forma segura.
- C) El observador solo registra el vuelo.
- D) El observador controla el enlace de datos.

**Correcta:** B

**Explicación:** El observador de la aeronave no tripulada es una persona situada al lado del piloto a distancia que, mediante la observación visual, ayuda al piloto a mantener la aeronave en modo VLOS y a efectuar el vuelo de forma segura.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 14.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q027 — Zonas geográficas UAS: consulta

**Opciones:**
- A) Se consultan en la web de la OACI.
- B) Se consultan en el mapa de zonas geográficas UAS publicado por AESA.
- C) Se consultan en la app de EASA.
- D) No existe un mapa público de zonas UAS.

**Correcta:** B

**Explicación:** Las zonas geográficas UAS se consultan en el visor cartográfico Enaire drones (https://drones.enaire.es/), publicado por AESA, que indica las zonas generales y particulares con restricciones o prohibiciones de vuelo.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 99-101.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q028 — Coordinación con aeródromos: volumen 45 m

**Opciones:**
- A) Es el volumen donde se permite volar sin coordinación.
- B) Es el volumen hasta 45 m de altura desde el ARP donde se requiere coordinación previa con el operador del aeródromo.
- C) Es la altura máxima de vuelo cerca de aeródromos.
- D) Es el radio mínimo de separación con otras aeronaves.

**Correcta:** B

**Explicación:** Hasta los 45 metros de altura medidos desde el Punto de Referencia de Aeródromo (ARP), se requiere coordinación previa con el gestor del aeródromo para la realización de operaciones con UAS. Por encima de los 45 m y hasta 900 m, se aplican áreas de mayor dimensión.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 104-109.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q029 — Limitaciones de percepción humana: distancia

**Opciones:**
- A) La distancia máxima de percepción visual efectiva es de 500 m.
- B) La distancia máxima de percepción visual efectiva es de 1 km.
- C) La distancia máxima de percepción visual efectiva es de 2 km.
- D) No existe una limitación de distancia.

**Correcta:** C

**Explicación:** Las limitaciones de percepción humana indican que la distancia máxima de percepción visual efectiva es de aproximadamente 2 km, lo que puede afectar la capacidad VLOS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 120.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q030 — Vuelo nocturno: luz verde

**Opciones:**
- A) No se permite el vuelo nocturno bajo ninguna circunstancia.
- B) Desde julio de 2022, se permite el vuelo nocturno si el UAS dispone de al menos una luz verde intermitente.
- C) Se permite si el piloto tiene gafas de visión nocturna.
- D) Se permite si el UAS tiene cámara térmica.

**Correcta:** B

**Explicación:** Desde julio de 2022, se permite el vuelo nocturno siempre que el UA esté equipado con al menos una luz verde intermitente, para aumentar la percepción visual del piloto y distinguir el UA de una aeronave tripulada.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 120.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q031 — Factores que afectan la visión del UAS (VLOS)

**Opciones:**
- A) Solo el contraste.
- B) El contraste, la superficie del terreno, las ayudas visuales, el tamaño del UAS y la luminosidad.
- C) Solo la distancia y la velocidad.
- D) Solo las condiciones meteorológicas.

**Correcta:** B

**Explicación:** Los factores que pueden afectar a la correcta visión del UAS (VLOS) incluyen: contraste (color del UAS similar al entorno), superficie del terreno (desniveles que puedan ocultar el UAS), ayudas visuales (luces o materiales reflectantes), tamaño del UAS (mayor tamaño = más visible) y luminosidad.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 119.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q032 — RGPD y UAS: imágenes de personas

**Opciones:**
- A) Se pueden capturar imágenes sin restricción alguna.
- B) Las imágenes que permiten identificar personas están sujetas al RGPD; el operador debe cumplir con la normativa de protección de datos.
- C) Solo se necesita permiso si se filma en interiores.
- D) Solo se necesita permiso si se filma de noche.

**Correcta:** B

**Explicación:** Las imágenes que permiten identificar a personas están sujetas al Reglamento General de Protección de Datos (RGPD). El operador debe cumplir con la normativa de protección de datos aplicable, y cualquier intrusión dentro de la vida privada es ilegal.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 121-124.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q033 — Restricciones del espacio aéreo: TSA y TRA

**Opciones:**
- A) TSA y TRA son tipos de UAS.
- B) TSA (Temporary Segregated Area) y TRA (Temporary Reserved Area) son zonas temporales del espacio aéreo que pueden afectar a la operación de UAS.
- C) Son sistemas de navegación GPS.
- D) Son frecuencias de comunicación.

**Correcta:** B

**Explicación:** TSA (Temporary Segregated Area) es el volumen de espacio aéreo delimitado temporalmente para el uso exclusivo de una actividad determinada. TRA (Temporary Reserved Area) es el volumen de espacio aéreo asignado para el uso específico de un usuario durante un periodo determinado. Ambas pueden restringir o segregar el espacio para operaciones con UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 102-103.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q034 — Persona no participante

**Opciones:**
- A) Cualquier persona que no participe en la operación del UAS o que no esté al corriente de las instrucciones y las precauciones de seguridad dadas por el operador.
- B) Cualquier persona que no tenga licencia de piloto.
- C) Cualquier espectador de un evento.
- D) Cualquier persona que no haya recibido formación en drones.

**Correcta:** A

**Explicación:** Una persona no participante es aquella que no participa en la operación del UAS o que no está al corriente de las instrucciones y las precauciones de seguridad dadas por el operador.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 14-15.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q035 — Definición de entorno urbano

**Opciones:**
- A) Cualquier zona con edificios de más de 3 plantas.
- B) Exclusivamente zonas comerciales e industriales.
- C) Núcleos de población con áreas consolidadas por la edificación, áreas residenciales, comerciales o industriales con accesos rodados y vías públicas pavimentadas, o áreas recreativas de acceso público con construcciones o instalaciones.
- D) Cualquier zona con presencia de personas.

**Correcta:** C

**Explicación:** Se consideran «entornos urbanos» aquellos que se circunscriban a alguna de las siguientes superficies: núcleos de población con áreas consolidadas por la edificación; áreas residenciales, comerciales o industriales con accesos rodados, vías públicas pavimentadas, evacuación de aguas y alumbrado público; y áreas recreativas de acceso público con construcciones o instalaciones permanentes o eventuales.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 15.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q036 — Modo sígueme (Follow Me)

**Opciones:**
- A) Es un modo de funcionamiento en el que la aeronave no tripulada sigue constantemente al piloto a distancia dentro de un radio predeterminado.
- B) Es un modo en el que el UAS sigue automáticamente a una posición GPS específica, sin que el piloto controle directamente la aeronave.
- C) Es un modo de vuelo manual con asistencia GPS.
- D) Es un modo que permite volar sin línea de datos.

**Correcta:** A

**Explicación:** El modo sígueme (Follow Me) es un modo de funcionamiento de un UAS en el que la aeronave no tripulada sigue constantemente al piloto a distancia dentro de un radio predeterminado.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 16.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q037 — DRI: Sistema de identificación a distancia directa (Remote ID)

**Opciones:**
- A) Es el código que identifica al enlace de datos del UAS.
- B) Es el sistema que garantiza la emisión local de información sobre las aeronaves no tripuladas en funcionamiento, incluido el marcado de estas aeronaves, de modo que esta información pueda obtenerse sin acceder físicamente a las aeronaves.
- C) Es el número de serie del mando de control.
- D) Es la frecuencia de comunicación del UAS.

**Correcta:** B

**Explicación:** El DRI (Sistema de identificación a distancia directa) es el sistema que garantiza la emisión local de información sobre las aeronaves no tripuladas en funcionamiento, incluido el marcado de estas aeronaves, de modo que esta información pueda obtenerse sin acceder físicamente a las aeronaves.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 16.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q038 — Categoría certificada: cuándo aplica

**Opciones:**
- A) Cuando se vuela sobre personas no participantes.
- B) Cuando la operación presenta un riesgo elevado y requiere un análisis de riesgo específico y certificación de la aeronave y la organización.
- C) Cuando se vuela en espacio aéreo controlado.
- D) Nunca se usa la categoría certificada.

**Correcta:** B

**Explicación:** La categoría certificada se aplica cuando la operación presenta un riesgo elevado, requiriendo un análisis de riesgo específico, certificación de la aeronave y certificación de la organización operadora.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 43.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q039 — Escenarios estándar STS

**Opciones:**
- A) Son procedimientos específicos que permiten operar en categoría específica con requisitos simplificados.
- B) Son escenas de vuelo predefinidas para entrenamiento.
- C) Son pruebas de certificación para pilotos.
- D) Son rutas de vuelo preaprobadas.

**Correcta:** A

**Explicación:** Los escenarios estándar (STS) son procedimientos que permiten operar en categoría específica con requisitos simplificados cuando se cumplen determinadas condiciones.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 42.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q040 — Sistema de geoconsciencia (Geo-awareness)

**Opciones:**
- A) Es la función que detecta una posible violación de las limitaciones del espacio aéreo y alerta a los pilotos a distancia para que puedan tomar medidas inmediatas.
- B) Es el conocimiento que tiene el piloto del espacio aéreo, zonas restringidas y limitaciones geográficas.
- C) Es el sistema GPS del UAS.
- D) Es la capacidad de volar sin línea de visión.

**Correcta:** A

**Explicación:** El sistema de geoconsciencia es una función que, sobre la base de los datos facilitados por los Estados miembros, detecta una posible violación de las limitaciones del espacio aéreo y alerta a los pilotos a distancia para que puedan tomar medidas inmediatas y eficaces para evitar esa violación.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 16.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

## Grupo C — Meteorología Aeronáutica (17 preguntas, Q041–Q057)

> **Rango de páginas:** 61–70, 86, 144 | **Temas:** presión, temperatura, densidad, humedad, viento, limitaciones meteorológicas del UAS, fuerzas aerodinámicas

### Q041 — Subcapa donde tiene lugar el vuelo de los UAS

**Opciones:**
- A) Estratosfera.
- B) Troposfera.
- C) Mesosfera.
- D) Ionosfera.

**Correcta:** B

**Explicación:** La troposfera es la subcapa de la atmósfera donde tiene lugar el vuelo de los UAS. Es la capa más baja de la atmósfera, donde se producen los fenómenos meteorológicos.

**Fuente:** «La subcapa donde tiene lugar el vuelo de los UAS se denomina troposfera.» — FOR-UAS-P01-DT01_Ed.09, pág. 67.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q042 — Variación de la presión atmosférica con la altitud

**Opciones:**
- A) Aumenta con la altitud.
- B) Se mantiene constante.
- C) Varía de forma impredecible.
- D) Disminuye con la altitud.

**Correcta:** D

**Explicación:** La presión se debe al peso del aire sobre un cierto punto de la superficie terrestre, por lo que a mayor altura, menor presión.

**Fuente:** «La presión se debe al peso de aire sobre un cierto punto de la superficie terrestre, por lo que a mayor altura, menor presión.» — FOR-UAS-P01-DT01_Ed.09, pág. 67.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q043 — Variación de la temperatura con la altitud en la troposfera

**Opciones:**
- A) Disminuye con la altitud.
- B) Aumenta con la altitud.
- C) Se mantiene constante.
- D) Varía independientemente de la altitud.

**Correcta:** A

**Explicación:** La temperatura disminuye con la altura debido a la absorción de calor de las distintas capas que componen la atmósfera. Cuando la temperatura disminuye, las moléculas ocupan menor espacio, reduciendo el volumen y aumentando la densidad.

**Fuente:** «La temperatura disminuye con la altura debido a la absorción de calor de las distintas capas que componen la atmósfera, de modo que cuando aumenta la temperatura las moléculas que componen el aire se dispersan, disminuyendo la densidad.» — FOR-UAS-P01-DT01_Ed.09, pág. 67.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q044 — Efecto de la humedad del aire en la densidad

**Opciones:**
- A) La aumenta.
- B) La mantiene constante.
- C) La disminuye.
- D) La duplica.

**Correcta:** C

**Explicación:** Debido a la menor densidad del vapor de agua respecto al aire seco, un volumen de aire húmedo pesa menos (es menos denso) que el mismo volumen de aire seco. Por lo tanto, cuando la humedad del aire es mayor, la densidad disminuye.

**Fuente:** «Debido a la menor densidad del vapor de agua respecto al aire seco, un determinado volumen de aire húmedo pesa menos (es menos denso) que el mismo volumen de aire seco. Por lo tanto, cuando la humedad del aire es mayor, la densidad disminuye.» — FOR-UAS-P01-DT01_Ed.09, pág. 69.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q045 — Efecto de la densidad sobre la sustentación

**Opciones:**
- A) La aumenta.
- B) La disminuye.
- C) No tiene efecto.
- D) La duplica.

**Correcta:** B

**Explicación:** Si la densidad del aire disminuye, la sustentación y la resistencia de la aeronave disminuyen.

**Fuente:** «Si la densidad del aire disminuye, la sustentación y la resistencia de la aeronave disminuyen.» — FOR-UAS-P01-DT01_Ed.09, pág. 68.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q046 — Ley de Boyle: volumen y presión

**Opciones:**
- A) Son directamente proporcionales.
- B) No tienen relación.
- C) El volumen es independiente de la presión.
- D) Son inversamente proporcionales.

**Correcta:** D

**Explicación:** Según la Ley de Boyle, a temperatura constante los volúmenes ocupados por un gas son inversamente proporcionales a las presiones a las que esté sometido.

**Fuente:** «Según la Ley de Boyle a temperatura constante los volúmenes ocupados por un gas son inversamente proporcionales a las presiones a las que esté sometido.» — FOR-UAS-P01-DT01_Ed.09, pág. 67.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q047 — Factores ambientales que afectan al rendimiento del UAS

**Opciones:**
- A) Densidad del aire, humedad y viento.
- B) Gravedad, magnetismo y electricidad.
- C) Solo la temperatura.
- D) Solo la presión atmosférica.

**Correcta:** A

**Explicación:** Los principales factores ambientales que pueden afectar al rendimiento de la aeronave y por lo tanto al vuelo son la densidad del aire, la humedad y el viento.

**Fuente:** «Los principales factores que pueden afectar son la densidad del aire, la humedad y el viento.» — FOR-UAS-P01-DT01_Ed.09, pág. 68.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q048 — Efectos del viento en el vuelo

**Opciones:**
- A) Solo la velocidad vertical.
- B) Solo la dirección.
- C) La autonomía y la maniobrabilidad.
- D) No tiene ningún efecto.

**Correcta:** C

**Explicación:** El viento puede afectar la autonomía y la maniobrabilidad de la aeronave. El viento en cara o en cola afecta al despegue, ascenso, crucero y aterrizaje.

**Fuente:** «El viento puede afectar la autonomía y la maniobrabilidad de la UA. El viento en cara o en cola afecta al despegue, ascenso, crucero, y aterrizaje de la aeronave.» — FOR-UAS-P01-DT01_Ed.09, pág. 69.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q049 — Efecto Venturi

**Opciones:**
- A) Al pasar por un estrechamiento, la velocidad del fluido aumenta y la presión disminuye.
- B) Al pasar por un estrechamiento, la velocidad del fluido disminuye y la presión aumenta.
- C) La presión total es siempre cero en un fluido en movimiento.
- D) La temperatura aumenta al pasar por un estrechamiento.

**Correcta:** A

**Explicación:** El efecto Venturi describe que al pasar por un estrechamiento las partículas de un fluido aumentan su velocidad mientras que la presión disminuye.

**Fuente:** «Efecto Venturi: Al pasar por un estrechamiento las partículas de un fluido aumentan su velocidad mientras que la presión disminuye.» — FOR-UAS-P01-DT01_Ed.09, pág. 61.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q050 — Principio de Bernoulli

**Opciones:**
- A) La presión estática aumenta.
- B) La presión total aumenta.
- C) La presión dinámica disminuye.
- D) La presión estática disminuye.

**Correcta:** D

**Explicación:** El principio de Bernoulli establece que en un fluido en movimiento la suma de la presión estática (pe) más la presión dinámica (pd), denominada presión total (pt), es constante: pt = pe + pd = constante. De donde se deduce que si la velocidad de un fluido se incrementa, la presión estática disminuye.

**Fuente:** «Principio de Bernoulli: En un fluido en movimiento la suma de la presión estática pe mas la presión dinámica pd, denominada presión total pt, es constante: pt= pe + pd = constante; de donde se deduce que si la velocidad de un fluido se incrementa, la presión estática disminuye.» — FOR-UAS-P01-DT01_Ed.09, pág. 61.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q051 — Fuerza aerodinámica que se opone al empuje

**Opciones:**
- A) Sustentación (lift).
- B) Peso (weight).
- C) Resistencia (drag).
- D) Gravedad.

**Correcta:** C

**Explicación:** La resistencia (Drag) es la fuerza aerodinámica que impide el avance de la aeronave a través del aire. Actúa en dirección opuesta a la trayectoria y de forma paralela al viento relativo. El empuje se opone a la resistencia.

**Fuente:** «Resistencia (D): Fuerza aerodinámica que impide el avance de la aeronave a través del aire. Actúa en dirección opuesta a la trayectoria y de forma paralela al viento relativo.» — FOR-UAS-P01-DT01_Ed.09, pág. 65.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q052 — Condición para que un UAS se eleve

**Opciones:**
- A) El empuje debe ser mayor que la resistencia.
- B) La resistencia debe ser mayor que la sustentación.
- C) La sustentación debe ser mayor que el peso.
- D) El peso debe ser mayor que la sustentación.

**Correcta:** C

**Explicación:** Para que un UAS se eleve, la fuerza de sustentación tiene que ser mayor que la fuerza de gravedad (peso). Para que avance, la fuerza de empuje tiene que ser mayor que la fuerza de resistencia.

**Fuente:** «En resumen, las fuerzas actúan de dos en dos, una siempre es contraria a la otra. Para que un UAS se eleve la fuerza de sustentación tiene que ser mayor que la fuerza de gravedad (peso) y para que avance la fuerza de empuje tiene que ser mayor que la fuerza de resistencia.» — FOR-UAS-P01-DT01_Ed.09, pág. 66.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q053 — Limitaciones meteorológicas del UAS (fabricante)

**Opciones:**
- A) Todos los UAS pueden volar en cualquier condición meteorológica.
- B) Cada UAS tiene limitaciones meteorológicas especificadas por el fabricante, como velocidad máxima del viento, temperatura operativa y protección contra lluvia.
- C) Las limitaciones meteorológicas dependen exclusivamente del peso del UAS.
- D) Las limitaciones meteorológicas están estandarizadas por EASA para todos los UAS.

**Correcta:** B

**Explicación:** Cada UAS tiene limitaciones meteorológicas especificadas por el fabricante, que el piloto debe consultar antes de volar. Estas incluyen velocidad máxima del viento, rango de temperatura operativa y protección contra precipitaciones.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 86.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q054 — Efectos del viento en la aeronave

**Opciones:**
- A) El viento no afecta al vuelo del UAS.
- B) El viento puede afectar la autonomía y la maniobrabilidad de la aeronave.
- C) El viento solo afecta al despegue.
- D) El viento solo afecta a la autonomía.

**Correcta:** B

**Explicación:** El viento puede afectar la autonomía y la maniobrabilidad de la aeronave. El viento en cara o en cola afecta al despegue, ascenso, crucero, y aterrizaje de la aeronave.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 69.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q055 — Efecto de la temperatura en las baterías

**Opciones:**
- A) El frío mejora el rendimiento de las baterías.
- B) Las bajas temperaturas reducen la capacidad y el rendimiento de las baterías, disminuyendo la autonomía del UAS.
- C) La temperatura no afecta a las baterías.
- D) Las baterías funcionan mejor a temperaturas extremas.

**Correcta:** B

**Explicación:** Las bajas temperaturas reducen la capacidad química de las baterías, disminuyendo su rendimiento y la autonomía del UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 144.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q056 — Presión estática + presión dinámica = presión total

**Opciones:**
- A) Es la Ley de Charles.
- B) Es el principio de Bernoulli.
- C) Es la Ley de Boyle.
- D) Es el efecto Venturi.

**Correcta:** B

**Explicación:** El principio de Bernoulli establece que la presión total (pt) es la suma de la presión estática (pe) y la presión dinámica (pd): pt = pe + pd = constante.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 61.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q057 — Relación entre velocidad y presión estática

**Opciones:**
- A) Cuando la velocidad aumenta, la presión estática aumenta.
- B) Cuando la velocidad aumenta, la presión estática disminuye.
- C) No hay relación entre velocidad y presión estática.
- D) Cuando la velocidad aumenta, la presión total disminuye.

**Correcta:** B

**Explicación:** Según el principio de Bernoulli, cuando la velocidad de un fluido aumenta, su presión estática disminuye para mantener constante la presión total.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 61.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q060 — Efectos del viento en la aeronave

**Opciones:**
- A) El viento no afecta al vuelo del UAS.
- B) El viento puede afectar la autonomía y la maniobrabilidad de la aeronave.
- C) El viento solo afecta al despegue.
- D) El viento solo afecta a la autonomía.

**Correcta:** B

**Explicación:** El viento puede afectar la autonomía y la maniobrabilidad de la aeronave. El viento en cara o en cola afecta al despegue, ascenso, crucero, y aterrizaje de la aeronave.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 69.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

## Grupo D — Contaminación Acústica (2 preguntas, Q061–Q062)

> **Nota:** Solo 1 página (pág. 36) con contenido sobre ruido en el PDF. Se mantienen objetivos modestos.

### Q061 — UAS que deben cumplir requisitos de ruido

**Opciones:**
- A) Solo los UAS de clase C0.
- B) Todos los UAS con marcado de clase desde C0 hasta C4 que no sean de ala fija.
- C) Solo los UAS de clase C4.
- D) Todos los UAS sin distinción de clase.

**Correcta:** B

**Explicación:** Todos los UAS con marcados de clase desde C0 hasta C4 que no sean de ala fija deben cumplir los requisitos de ruido.

**Fuente:** «Todos los UAS con marcados de clase desde C0 hasta C4 que no sean de ala fija deben de cumplir los requisitos de ruido.» — FOR-UAS-P01-DT01_Ed.09, pág. 36.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q062 — Marcado del nivel de sonido

**Opciones:**
- A) Debe aparecer en la batería del UAS.
- B) Debe aparecer en el mando de control.
- C) Debe aparecer en el plano de vuelo.
- D) Debe aparecer en el propio UA o en su caja.

**Correcta:** D

**Explicación:** El marcado del UAS debe incluir una indicación del nivel de sonido de ponderación A en el propio UA o en su caja.

**Fuente:** «Para cumplir con esta normativa, el marcado del UAS debe de incluir una indicación en el UA o en su caja de nivel de sonido de ponderación A.» — FOR-UAS-P01-DT01_Ed.09, pág. 36.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

## Grupo E — Planificación del Vuelo (20 preguntas, Q065–Q084)

> **Rango de páginas:** 143–149, 157–160 | **Temas:** MEUH, evaluación del entorno, inspección, I'M SAFE, registros, mantenimiento

### Q065 — Concepto MEUH

**Opciones:**
- A) Meteorología, Equipamiento, UAS, Humanas.
- B) Meteorología, Entorno, Uso, Humano.
- C) Meteorología, Entorno, UAS, Limitaciones Humanas.
- D) Mantenimiento, Entorno, UAS, Humano.

**Correcta:** C

**Explicación:** El concepto MEUH se refiere a: Meteorología (M), Entorno (E), UAS (U) y Limitaciones Humanas (H). Son los cuatro aspectos que el piloto debe verificar antes de iniciar una operación.

**Fuente:** «Antes de iniciar un vuelo con UAS se deben comprobar una serie de elementos que pueden afectar a la seguridad de la operación. Para realizar esta comprobación, el operador o el piloto a distancia debe verificar, empleando el «concepto MEUH», los siguientes componentes: Meteorología (M), Entorno (E), UAS (U), Limitaciones Humanas (H).» — FOR-UAS-P01-DT01_Ed.09, pág. 143.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q066 — Factores meteorológicos que afectan el rendimiento

**Opciones:**
- A) Solo la temperatura.
- B) Viento, temperatura, visibilidad, lluvia o nieve.
- C) Solo el viento y la visibilidad.
- D) Solo la humedad y la presión.

**Correcta:** B

**Explicación:** Los factores que pueden afectar el rendimiento de la aeronave son: viento (afecta autonomía y maniobrabilidad), temperatura (afecta autonomía y rendimiento de baterías), visibilidad (afecta capacidad VLOS), y lluvia o nieve (consultar las instrucciones del fabricante).

**Fuente:** «Los siguientes factores pueden afectar el rendimiento de la aeronave, causando efectos no deseados y poniendo en riesgo la seguridad del vuelo: Viento, Temperatura, Visibilidad, Lluvia o nieve.» — FOR-UAS-P01-DT01_Ed.09, pág. 144.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q067 — Cambio meteorológico durante la operación

**Opciones:**
- A) Cancelar el vuelo.
- B) Seguir volando a menor altura.
- C) Aumentar la velocidad de retorno.
- D) No afecta la operación.

**Correcta:** A

**Explicación:** Si durante la operación el piloto observa un cambio en las condiciones meteorológicas que pueda afectar a la seguridad y rendimiento de la aeronave, cancelará el vuelo.

**Fuente:** «Si durante la operación el piloto observa un cambio en las condiciones meteorológicas que pueda afectar a la seguridad y rendimiento de la aeronave, cancelará el vuelo.» — FOR-UAS-P01-DT01_Ed.09, pág. 144.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q068 — Exploración visual del área de operación

**Opciones:**
- A) Solo verificar la señal de radio.
- B) Medir la temperatura del terreno.
- C) Calcular el tiempo de vuelo exacto.
- D) Detectar obstáculos, personas no participantes y posibles interferencias electromagnéticas.

**Correcta:** D

**Explicación:** La exploración del área de operación tiene como objetivo: detectar obstáculos (edificios, vehículos, líneas de tensión, etc.), detectar personas no participantes o concentraciones de personas, y detectar posibles interferencias electromagnéticas.

**Fuente:** «El objetivo de esta exploración es: Detectar y tener en cuenta los posibles obstáculos … Detectar la presencia de personas no participantes en la operación o concentraciones de personas. Detectar posibles interferencias electromagnéticas.» — FOR-UAS-P01-DT01_Ed.09, págs. 146–147.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q069 — Metodología I'M SAFE

**Opciones:**
- A) OODA (Observar – Ver opciones – Decidir – Actuar).
- B) I'M SAFE (Illness, Medication, Stress, Alcohol, Fatigue, Emotions).
- C) MEUH (Meteorología, Entorno, UAS, Humanas).
- D) VLOS (Visual line of sight).

**Correcta:** B

**Explicación:** El piloto a distancia debe usar la metodología I'M SAFE para verificar sus limitaciones humanas: I (Enfermedad/Illness), M (Medicación), S (Estrés/Stress), A (Alcohol), F (Fatiga), E (Emociones).

**Fuente:** «Antes de iniciar una operación, el piloto a distancia debe verificar que se encuentra en condiciones óptimas para llevar a cabo la operación. Para ello, el piloto a distancia deberá usar la metodología I'M SAFE.» — FOR-UAS-P01-DT01_Ed.09, pág. 149.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q070 — I'M SAFE: I (Enfermedad)

**Opciones:**
- A) Inspección (Inspection).
- B) Intensidad (Intensity).
- C) Información (Information).
- D) Enfermedad (Illness).

**Correcta:** D

**Explicación:** La «I» en I'M SAFE significa Illness (Enfermedad). El piloto debe evaluar si una enfermedad puede afectar su capacidad para volar de forma segura.

**Fuente:** «I: ENFERMEDAD («ILLNESS»). Resfriados, alergias u otras enfermedades comunes pueden provocar malestar en el piloto a distancia, como por ejemplo irritación en los ojos o dolor de cabeza, lo cual puede acabar afectando a la seguridad del vuelo.» — FOR-UAS-P01-DT01_Ed.09, pág. 115.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q071 — Listas de control (checklist)

**Opciones:**
- A) Un plan de vuelo electrónico.
- B) Un registro de vuelos.
- C) Listas de control (checklist).
- D) Un sistema de GPS.

**Correcta:** C

**Explicación:** Es recomendable el uso de listas de control (checklist) para asegurar que todos los puntos necesarios han sido comprobados en la inspección exterior del UAS previa al vuelo.

**Fuente:** «Para ello deberá realizar una inspección exterior del equipo siguiendo una secuencia de actuación según las instrucciones del fabricante. Es recomendable el uso de listas de control (checklist), para asegurar que todos los puntos necesarios han sido comprobados.» — FOR-UAS-P01-DT01_Ed.09, pág. 148.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q072 — Registro de vuelos

**Opciones:**
- A) Solo la hora de aterrizaje.
- B) Solo el estado de la batería.
- C) Solo las incidencias.
- D) Toda la información relevante del vuelo, especialmente las horas de vuelo.

**Correcta:** D

**Explicación:** Una vez finalizada la operación, el piloto debe anotar en el registro de vuelos toda la información relevante, especialmente las horas de vuelo, para tener un control sobre el estado global de la aeronave y las horas totales de vuelo, de cara al mantenimiento.

**Fuente:** «Una vez se ha finalizado la operación, el piloto debe anotar en el registro de vuelos de la aeronave toda la información relevante del vuelo, especialmente las horas de vuelo del mismo. De esta forma se tiene un control sobre el estado global de la aeronave y las horas totales de vuelo, de cara a realizar el mantenimiento necesario.» — FOR-UAS-P01-DT01_Ed.09, pág. 157.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q073 — Evaluación del entorno: normativa y zonificación

**Opciones:**
- A) No es necesario evaluar la normativa antes de volar.
- B) El piloto debe verificar la normativa aplicable, las limitaciones de la zona y la zonificación AESA antes de operar.
- C) Solo es necesario verificar la meteorología.
- D) Solo es necesario verificar el estado del UAS.

**Correcta:** B

**Explicación:** El piloto debe verificar la normativa aplicable, las limitaciones de la zona y la zonificación AESA antes de operar, asegurándose de que la operación es legal en la zona seleccionada.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 145.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q074 — Exploración del terreno: tipos de obstáculos

**Opciones:**
- A) Solo edificios y vehículos.
- B) Edificios, árboles, líneas de tensión, torres, vehículos, vías públicas y cualquier otro obstáculo que pueda interferir con el vuelo.
- C) Solo líneas de tensión y torres.
- D) Solo árboles y edificios.

**Correcta:** B

**Explicación:** La exploración del terreno debe detectar todo tipo de obstáculos: edificios, árboles, líneas de tensión, torres, vehículos, vías públicas y cualquier elemento que pueda interferir con el vuelo seguro.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 146.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q075 — Interferencias electromagnéticas: fuentes comunes

**Opciones:**
- A) Solo las torres de alta tensión.
- B) Wi-Fi, Bluetooth, antenas de radio, TV, torres de alta tensión y otras fuentes de ondas electromagnéticas.
- C) Solo los teléfonos móviles.
- D) No existen interferencias electromagnéticas relevantes.

**Correcta:** B

**Explicación:** Las interferencias electromagnéticas pueden provenir de Wi-Fi, Bluetooth, antenas de radio, TV, torres de alta tensión y otras fuentes de ondas electromagnéticas que pueden afectar al enlace de control del UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 147.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q076 — Inspección exterior: elementos a verificar

**Opciones:**
- A) Solo las hélices.
- B) Estructura, hélices, motores, baterías, sensores, sistema de comunicación y cualquier elemento susceptible de desgaste.
- C) Solo la batería y el mando.
- D) Solo el sistema GPS.

**Correcta:** B

**Explicación:** La inspección exterior debe cubrir: estructura, hélices, motores, baterías, sensores, sistema de comunicación y cualquier elemento susceptible de desgaste según las instrucciones del fabricante.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 148.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q077 — I'M SAFE: M (Medicación)

**Opciones:**
- A) El piloto debe verificar si está tomando medicación que pueda afectar su capacidad de vuelo.
- B) El piloto debe verificar si el UAS tiene medicación a bordo.
- C) El piloto debe verificar la temperatura de la medicación.
- D) El piloto no necesita verificar la medicación.

**Correcta:** A

**Explicación:** La «M» en I'M SAFE significa Medication (Medicación). El piloto debe evaluar si está tomando medicación que pueda afectar su capacidad de vuelo de forma segura.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 149.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q078 — I'M SAFE: S (Estrés)

**Opciones:**
- A) El estrés siempre mejora el rendimiento del piloto.
- B) El estrés puede afectar la capacidad del piloto para tomar decisiones y responder adecuadamente durante la operación.
- C) El estrés no afecta al vuelo de UAS.
- D) El estrés solo afecta a pilotos principiantes.

**Correcta:** B

**Explicación:** El estrés (Stress) puede afectar significativamente la capacidad del piloto para tomar decisiones, mantener la concentración y responder adecuadamente durante la operación.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 149.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q079 — I'M SAFE: F (Fatiga)

**Opciones:**
- A) La fatiga no afecta al vuelo si el piloto tiene experiencia.
- B) La fatiga reduce la capacidad de reacción, la concentración y la toma de decisiones del piloto.
- C) La fatiga solo afecta a vuelos largos.
- D) La fatiga mejora la atención del piloto.

**Correcta:** B

**Explicación:** La fatiga (Fatigue) reduce significativamente la capacidad de reacción, la concentración y la toma de decisiones del piloto, comprometiendo la seguridad del vuelo.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 149.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q080 — I'M SAFE: E (Emociones)

**Opciones:**
- A) Las emociones siempre mejoran el rendimiento.
- B) Las emociones intensas (alegría excesiva, tristeza, ansiedad) pueden afectar la capacidad del piloto para volar de forma segura.
- C) Las emociones solo afectan a pilotos novatos.
- D) Las emociones no son relevantes para la operación de UAS.

**Correcta:** B

**Explicación:** Las emociones (Emotions) intensas, ya sean positivas o negativas, pueden afectar la capacidad del piloto para mantener la concentración y tomar decisiones seguras.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 149.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q081 — Mantenimiento post-vuelo: revisión de incidencias

**Opciones:**
- A) No es necesario revisar el UAS después del vuelo.
- B) Después de cada vuelo, el piloto debe revisar el UAS para detectar cualquier incidencia, daño o desgaste que requiera atención.
- C) Solo se revisa el UAS una vez al mes.
- D) Solo se revisa el UAS antes del vuelo.

**Correcta:** B

**Explicación:** Después de cada vuelo, el piloto debe revisar el UAS para detectar cualquier incidencia, daño o desgaste que requiera atención antes del siguiente vuelo.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 157.

**Dificultad:** EASY

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q082 — Mantenimiento periódico según fabricante

**Opciones:**
- A) El mantenimiento periódico no es necesario.
- B) El fabricante establece intervalos de mantenimiento periódico que el operador debe seguir para garantizar la seguridad y el rendimiento del UAS.
- C) El mantenimiento se realiza solo cuando el UAS falla.
- D) El mantenimiento lo realiza exclusivamente AESA.

**Correcta:** B

**Explicación:** El fabricante establece intervalos y procedimientos de mantenimiento periódico que el operador debe seguir para garantizar la seguridad y el rendimiento del UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 157.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q083 — Procedimientos operacionales: cuándo deben estar escritos

**Opciones:**
- A) Nunca es necesario tener procedimientos escritos.
- B) Los procedimientos operacionales deben estar escritos cuando la operación lo requiera, especialmente en categoría «específica» o «certificada».
- C) Solo son necesarios para UAS de gran tamaño.
- D) Solo son necesarios para operaciones comerciales.

**Correcta:** B

**Explicación:** Los procedimientos operacionales deberán estar escritos cuando el operador y el piloto a distancia no sean la misma persona. En otro caso, se podrán seguir los procedimientos descritos en las instrucciones facilitadas por el fabricante del UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 158.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q084 — Limitaciones humanas: percepción de velocidad

**Opciones:**
- A) Los humanos perciben la velocidad de forma exacta.
- B) La percepción humana de la velocidad es imprecisa, especialmente a distancias largas y con objetos pequeños como los UAS.
- C) La percepción de velocidad mejora con la experiencia.
- D) Los humanos perciben mejor la velocidad que los instrumentos.

**Correcta:** B

**Explicación:** La percepción humana de la velocidad es imprecisa, especialmente a distancias largas y con objetos pequeños como los UAS, lo que puede afectar la capacidad del piloto para estimar distancias y tiempos.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 120.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

## Grupo F — Operaciones Especiales (15 preguntas, Q085–Q099)

> **Rango de páginas:** 13–13, 150–156, 157–160 | **Temas:** consciencia situacional, OODA, operación normal, contingencia, emergencia, procedimientos especiales

### Q085 — Consciencia situacional

**Opciones:**
- A) La capacidad de volar sin instrumentos.
- B) La percepción de uno mismo y su aeronave en relación al ambiente dinámico del vuelo, con capacidad para pronosticar lo que ocurrirá basado en la percepción del entorno.
- C) La habilidad de comunicarse con el control de tránsito aéreo.
- D) La capacidad de volar más rápido que otros UAS.

**Correcta:** B

**Explicación:** La consciencia situacional es la percepción de uno mismo y su aeronave en relación al ambiente dinámico del vuelo, con capacidad para pronosticar lo que ocurrirá basado en la percepción del entorno (saber y conocer lo que ocurre en cada momento para poder gestionar los riesgos).

**Fuente:** «Consciencia situacional: Es la percepción de uno mismo y su aeronave en relación al ambiente dinámico del vuelo, con capacidad para pronosticar lo que ocurrirá basado en la percepción del entorno (saber y conocer lo que ocurre en cada momento para poder gestionar los riesgos).» — FOR-UAS-P01-DT01_Ed.09, pág. 13.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q086 — Componentes de la consciencia situacional

**Opciones:**
- A) Percepción, comprensión y proyección.
- B) Observar, decidir y actuar.
- C) Planificar, ejecutar y revisar.
- D) Identificar, evaluar y mitigar.

**Correcta:** A

**Explicación:** Los tres componentes principales de la consciencia situacional son: Percepción (el piloto es capaz de percibir y reconocer todos los elementos que tiene alrededor), Comprensión (el piloto es capaz de comprender e interpretar los elementos que percibe) y Proyección (el piloto es capaz de anticipar mentalmente y prevenir los posibles eventos).

**Fuente:** «Los tres componentes principales de la consciencia situacional son: Percepción … Comprensión … Proyección.» — FOR-UAS-P01-DT01_Ed.09, pág. 151.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q087 — Técnica OODA

**Opciones:**
- A) MEUH (Meteorología, Entorno, UAS, Humanas).
- B) VLOS (Visual line of sight).
- C) OODA (Observar – Ver opciones – Decidir – Actuar).
- D) I'M SAFE (Illness, Medication, Stress, Alcohol, Fatigue, Emotions).

**Correcta:** C

**Explicación:** Los componentes de la consciencia situacional se llevan a la práctica mediante la técnica OODA, que consiste en: 1. Observar, 2. Ver opciones, 3. Decidir, 4. Actuar.

**Fuente:** «Los componentes de la consciencia situacional (percepción, comprensión y proyección) se llevan a la práctica mediante la técnica OODA, la cual consiste en que el piloto a distancia es capaz de Observar – Ver Opciones – Decidir - Actuar.» — FOR-UAS-P01-DT01_Ed.09, pág. 152.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q088 — Pérdida o degradación de la señal GNSS

**Opciones:**
- A) Activar el modo automático y continuar el vuelo.
- B) Esperar a que la señal se recupere sola.
- C) Aumentar la altura de vuelo para mejorar la señal.
- D) Activar el modo manual y aterrizar la aeronave.

**Correcta:** D

**Explicación:** En caso de pérdida o degradación de la señal GNSS, el piloto a distancia deberá activar el modo manual y aterrizar la aeronave. En tierra se debe verificar el funcionamiento del sistema y repararlo si fuera necesario.

**Fuente:** «En caso de pérdida o degradación de la señal GNSS, el piloto a distancia deberá activar el modo manual y aterrizar la aeronave. En tierra se debe verificar el funcionamiento del sistema y se deberá reparar si fuera necesario.» — FOR-UAS-P01-DT01_Ed.09, pág. 155.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q089 — Aeronave tripulada cerca del área de operación

**Opciones:**
- A) Mantener el vuelo y aumentar la altura.
- B) Activar el modo RTH (vuelta a casa).
- C) Esperar a que la aeronave se aleje sola.
- D) Aterrizar el UAS a la mayor brevedad posible.

**Correcta:** D

**Explicación:** Si se observa una aeronave tripulada volando cerca del área de operación, el UAS deberá ser aterrizado a la mayor brevedad posible.

**Fuente:** «Si se observa una aeronave tripulada volando cerca el área de operación, el UAS deberá ser aterrizado a la mayor brevedad posible.» — FOR-UAS-P01-DT01_Ed.09, pág. 156.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q090 — Operación normal vs contingencia vs emergencia

**Opciones:**
- A) Son lo mismo bajo diferentes nombres.
- B) La operación normal es el vuelo sin incidencias; la contingencia es una situación prevista que requiere procedimiento específico; la emergencia es una situación no prevista que amenaza la seguridad.
- C) La contingencia es más grave que la emergencia.
- D) La operación normal incluye todas las situaciones.

**Correcta:** B

**Explicación:** La operación normal es el vuelo sin incidencias. La contingencia es una situación prevista que requiere un procedimiento específico. La emergencia es una situación no prevista que amenaza la seguridad.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 150.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q091 — Parámetros a monitorizar durante el vuelo

**Opciones:**
- A) Solo la batería.
- B) La coordinación con el entorno, las condiciones meteorológicas, el estado de la batería, la telemetría y cualquier parámetro relevante del UAS.
- C) Solo la posición GPS.
- D) Solo la velocidad del viento.

**Correcta:** B

**Explicación:** Durante el vuelo, el piloto debe monitorizar: coordinación con el entorno, condiciones meteorológicas, estado de la batería, telemetría y cualquier parámetro relevante del UAS.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 150.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q092 — Procedimiento: situación anormal general

**Opciones:**
- A) Continuar el vuelo sin cambios.
- B) Activar el modo automático y esperar.
- C) Evaluar la situación, activar el procedimiento correspondiente y, si es necesario, aterrizar la aeronave.
- D) Llamar a AESA inmediatamente.

**Correcta:** C

**Explicación:** Ante una situación anormal, el piloto debe evaluar la situación, activar el procedimiento correspondiente y, si es necesario, aterrizar la aeronave de forma segura.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 155.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q093 — Procedimiento: persona en el área de operación

**Opciones:**
- A) Continuar el vuelo y aumentar la altura.
- B) Aterrizar la aeronave de forma manual, evitando en la medida de lo posible poner en riesgo a la persona.
- C) Activar el modo RTH y esperar.
- D) Ignorar a la persona si no está en la trayectoria directa.

**Correcta:** B

**Explicación:** Si aparece una persona en el área de operación, el piloto debe aterrizar la aeronave de forma manual, evitando en la medida de lo posible poner en riesgo a la persona.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 155.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q094 — Procedimiento: salida de zona de operación

**Opciones:**
- A) Continuar volando fuera de la zona.
- B) Activar el modo RTH (vuelta a casa) o aterrizar la aeronave de forma segura dentro de la zona de operación.
- C) Aumentar la velocidad de vuelo.
- D) Cambiar a modo manual y seguir volando.

**Correcta:** B

**Explicación:** Si el UAS sale de la zona de operación, el piloto debe activar el modo RTH (vuelta a casa) o aterrizar la aeronave de forma segura dentro de la zona de operación.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 155.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q095 — Procedimiento: otro UAS en el área de operación

**Opciones:**
- A) Mantener la trayectoria y aumentar la velocidad.
- B) Evaluar la situación, maniobrar para evitar colisión y, si es necesario, aterrizar la aeronave.
- C) Comunicarse con el otro piloto por radio.
- D) Activar el modo automático y esperar.

**Correcta:** B

**Explicación:** Si otro UAS aparece en el área de operación, el piloto debe evaluar la situación, maniobrar para evitar colisión y, si es necesario, aterrizar la aeronave de forma segura.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 156.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q096 — Procedimiento: cambio meteorológico que altera el control

**Opciones:**
- A) Continuar el vuelo y esperar a que mejore.
- B) Aterrizar la aeronave lo antes posible para evitar que las condiciones meteorológicas comprometan el control del UAS.
- C) Aumentar la altura para evitar el mal tiempo.
- D) Activar el modo RTH y no hacer nada más.

**Correcta:** B

**Explicación:** Si las condiciones meteorológicas cambian de forma que pueden comprometer el control del UAS, el piloto debe aterrizar la aeronave lo antes posible.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 156.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q097 — Procedimiento: pérdida/degradación del enlace C2

**Opciones:**
- A) Continuar volando y esperar la recuperación del enlace.
- B) Aterrizar la aeronave inmediatamente de forma manual, o activar el procedimiento de fallo de enlace si está disponible.
- C) Aumentar la potencia del enlace.
- D) Cambiar de frecuencia automáticamente.

**Correcta:** B

**Explicación:** En caso de pérdida o degradación del enlace C2 (control y navegación), el piloto debe aterrizar la aeronave inmediatamente de forma manual, o activar el procedimiento de fallo de enlace si está disponible.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 156.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q098 — Procedimiento de contingencia: cuándo activar

**Opciones:**
- A) Siempre que el UAS se aleje de la zona de operación.
- B) Cuando se produce una situación no prevista que requiere un procedimiento específico diferente al de emergencia.
- C) Solo cuando hay una aeronave tripulada cerca.
- D) Nunca se activa el procedimiento de contingencia.

**Correcta:** B

**Explicación:** El procedimiento de contingencia se activa cuando se produce una situación no prevista que requiere un procedimiento específico, pero que no constituye una emergencia inmediata.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 160.

**Dificultad:** HARD

**Estado:** [x] Verificada | [x] Insertada en BD

---

### Q099 — Procedimiento post-vuelo: inspección tras incidente

**Opciones:**
- A) No es necesario inspeccionar tras un incidente.
- B) Tras cualquier incidente o situación anormal, se debe realizar una inspección exhaustiva del UAS antes de volver a volar.
- C) Solo se inspecciona si el UAS cayó al suelo.
- D) Solo se inspecciona si el UAS se apagó.

**Correcta:** B

**Explicación:** Tras cualquier incidente o situación anormal, se debe realizar una inspección exhaustiva del UAS antes de volver a volar, verificando todos los sistemas y componentes.

**Fuente:** FOR-UAS-P01-DT01_Ed.09, pág. 157, 160.

**Dificultad:** MEDIUM

**Estado:** [x] Verificada | [x] Insertada en BD

---

## Progreso por grupo

| Grupo | Tema | Preguntas | Progreso |
|-------|------|-----------|----------|
| A | Marco Legal | Q001–Q020 (20) | [x] 20/20 |
| B | Limitaciones de Vuelo | Q021–Q040 (20) | [x] 20/20 |
| C | Meteorología Aeronáutica | Q041–Q057 (17) | [x] 17/17 |
| D | Contaminación Acústica | Q061–Q062 (2) | [x] 2/2 |
| E | Planificación del Vuelo | Q065–Q084 (20) | [x] 20/20 |
| F | Operaciones Especiales | Q085–Q099 (15) | [x] 15/15 |
| **Total** | | **94** | **[x] 94/94** |

---

## Script de inserción incremental

Se usará el script `prisma/seed-questions-batch.ts` que:
1. Lee un archivo Markdown con preguntas (puede ser este mismo archivo o archivos por grupo).
2. Parsea las preguntas marcadas como `[x] Verificada`.
3. Inserta en BD usando el mismo patrón de `seed-questions.ts`.
4. Marca las preguntas como `[x] Insertada en BD`.

Uso: `npx tsx prisma/seed-questions-batch.ts docs/banco-preguntas.md --group A`
