// Interfaz que define la estructura estricta de un mito médico
export interface MythItem {
  id: string; // Identificador único para gestionar la apertura/cierre del acordeón
  stage: "menstruation" | "pregnancy" | "menopause" | string; // Etapa biológica asociada al mito
  myth: string; // Pregunta o creencia popular a desmentir
  fact: string; // Verdad médica resumida y directa
  explanation: string; // Explicación amigable con enfoque de respeto comunitario
  scientificBasis: string; // Fundamento clínico o científico comprobado
}

// Interfaz que define la estructura estricta de un término del glosario
export interface GlossaryItem {
  termEs: string; // Nombre del concepto o término en idioma Español
  termMi?: string; // Traducción opcional del término al idioma Miskito
  meaning: string; // Explicación sencilla del significado del término
  category: "stage" | "anatomy" | "traditional_medicine" | "feeling" | string; // Categoría para filtrado en la interfaz
}

// Array constante con la colección completa de mitos y sus explicaciones científicas
export const MYTHS_DB: MythItem[] = [
  {
    id: "m1", // ID único de la primera tarjeta de mito
    stage: "menstruation", // Clasificación dentro de la etapa de menstruación
    myth: "Bañarse con agua fría durante el periodo corta el sangrado o enferma", // Texto del mito popular
    fact: "El agua fría no altera el ciclo menstrual ni corta el sangrado.", // Respuesta médica directa
    explanation:
      "El sangrado es un proceso hormonal uterino. Lavarse o ducharse es seguro y promueve la higiene.", // Explicación comprensible
    scientificBasis:
      "La evidencia ginecológica demuestra que la temperatura del agua no afecta la descamación endometrial.", // Evidencia científica
  },
  {
    id: "m2", // ID único de la segunda tarjeta de mito
    stage: "pregnancy", // Clasificación dentro de la etapa de embarazo
    myth: "La forma del vientre indica el sexo del bebé", // Texto del mito popular
    fact: "La forma del vientre depende de la anatomía materna y posición del bebé.", // Respuesta médica directa
    explanation:
      "La tonicidad muscular y postura de la madre definen la silueta, no si es niño o niña.", // Explicación comprensible
    scientificBasis:
      "El sexo biológico solo puede confirmarse mediante ecografía obstétrica o estudios genéticos.", // Evidencia científica
  },
  {
    id: "m3", // ID único de la tercera tarjeta de mito
    stage: "menopause", // Clasificación dentro de la etapa de menopausia
    myth: "La menopausia significa el fin de la vida sexual activa", // Texto del mito popular
    fact: "Marca el fin de la fertilidad, no del deseo ni del disfrute personal.", // Respuesta médica directa
    explanation:
      "Con cuidados adecuados y lubricación, se puede mantener un bienestar pleno en esta etapa.", // Explicación comprensible
    scientificBasis:
      "La baja hormonal genera cambios fisiológicos tratables que no anulan la respuesta sexual.", // Evidencia científica
  },
];

// Array constante con los términos del glosario bilingüe y sus categorías
export const GLOSSARY_DATA: GlossaryItem[] = [
  {
    termEs: "Útero / Matriz", // Concepto anatómico en Español
    termMi: "Luhpia utla", // Equivalente en Miskito
    meaning:
      "Órgano muscular donde se desarrolla el bebé y de donde proviene el sangrado menstrual.", // Definición sencilla
    category: "anatomy", // Filtro asignado a la categoría de anatomía
  },
  {
    termEs: "Menstruación / Regla", // Concepto de etapa biológica en Español
    termMi: "Kati tara", // Equivalente en Miskito
    meaning:
      "Sangrado mensual cíclico que indica la descamación natural del revestimiento del útero.", // Definición sencilla
    category: "stage", // Filtro asignado a la categoría de etapas
  },
  {
    termEs: "Manzanilla", // Planta medicinal tradicional en Español
    termMi: "Sika dusa manzanilla", // Nombre atribuido en Miskito
    meaning:
      "Planta medicinal empleada en infusiones para aliviar dolores y cólicos leves.", // Definición sencilla
    category: "traditional_medicine", // Filtro asignado a la categoría de medicina tradicional
  },
  {
    termEs: "Tranquilidad / Calma", // Estado de ánimo en Español
    termMi: "Kupia kraika pain", // Equivalente emocional en Miskito
    meaning:
      "Estado de bienestar emocional y paz mental relevante en las etapas de cambio hormonal.", // Definición sencilla
    category: "feeling", // Filtro asignado a la categoría de bienestar y ánimo
  },
];
