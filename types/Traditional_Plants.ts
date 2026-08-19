// Definimos la estructura de una planta medicinal tradicional.
export interface TraditionalPlant {
  // Nombre principal de la planta.
  name: string;

  // Uso tradicional mostrado en el formulario.
  usage: string;

  // Forma de preparación mostrada en el formulario.
  preparation: string;

  // Traducciones disponibles para la planta.
  languages: Record<string, string>;
}

// Catálogo de plantas utilizadas por el Diario de Síntomas.
export const TRADITIONAL_PLANTS: TraditionalPlant[] = [
  {
    // Planta utilizada por la lógica original para menstruación,
    // cólicos y dolor de cabeza.
    name: "Manzanilla",

    // Descripción del uso que aparecerá junto al nombre.
    usage: "apoyo digestivo y relajante",

    // Preparación mostrada a la usuaria.
    preparation: "Infusión.",

    // Traducciones disponibles.
    languages: {
      // Español.
      es: "Manzanilla",

      // Miskito.
      mi: "Manzanilla",

      // Mayagna
      ma: " ",
    },
  },

  {
    // Segunda planta utilizada por la lógica original.
    name: "Orégano",

    // Uso tradicional.
    usage: "apoyo digestivo",

    // Forma de preparación.
    preparation: "Infusión.",

    // Traducciones.
    languages: {
      // Español.
      es: "Orégano",

      // Miskito.
      mi: "Orégano",

      // Mayagna
      ma: " ",
    },
  },

  {
    // Planta utilizada principalmente para la etapa de menopausia
    // y síntomas relacionados con cansancio.
    name: "Maca",

    // Uso tradicional.
    usage: "apoyo durante el cansancio",

    // Forma de preparación.
    preparation: "Preparación tradicional.",

    // Traducciones.
    languages: {
      // Español.
      es: "Maca",

      // Miskito.
      mi: "Maca",

      // Mayagna
      ma: " ",
    },
  },

  {
    // Planta utilizada por la lógica original para embarazo
    // o cansancio.
    name: "Muña",

    // Uso tradicional.
    usage: "apoyo digestivo tradicional",

    // Forma de preparación.
    preparation: "Infusión.",

    // Traducciones.
    languages: {
      // Español.
      es: "Muña",

      // Miskito.
      mi: "Muña",

      // Mayagna
      ma: " ",
    },
  },
];

/*export const TRADITIONAL_PLANTS = [
  {
    name: "Manzanilla (Chamomile)",
    usage: "Cólicos menstruales y relajación",
    preparation:
      "Infundir 3 flores en agua hirviendo por 5 minutos. Tomar templado de 2 a 3 veces por día.",
    scientificNote:
      "Tiene propiedades antiespasmódicas y ansiolíticas comprobadas científicamente que relajan la musculatura uterina.",
    languages: {
      es: "Manzanilla",
      mi: "Manzanilla dusa ya mairin kati pain daukiba dusa sika pain sa.",
      ma: "",
    },
  },
  {
    name: "Maca Andina (Lepidium meyenii)",
    usage: "Vitalidad y regulación de bochornos en menopausia",
    preparation:
      "Consumir 1 cucharadita de polvo en el desayuno (disuelto en avena o quinua).",
    scientificNote:
      "Es un adaptógeno que equilibra el sistema endocrino y ayuda a suavizar las oscilaciones hormonales en la transición climatérica.",
    languages: {
      es: "Maca Andina",
      mi: "Maca dusa wina ch'ama chura sa, lapta kani mairin tura laka pain siska.",
      ma: "",
    },
  },
  {
    name: "Muña (Minthostachys mollis)",
    usage: "Náuseas leves del embarazo e hinchazón digestiva",
    preparation:
      "En infusión muy ligera (solo 2 hojas por taza). Tomar a pequeños sorbos por la mañana.",
    scientificNote:
      "Excelente digestivo y analgésico estomacal. En el embarazo debe usarse con moderación (evitar dosis muy concentradas u aceites esenciales).",
    languages: {
      es: "Muña",
      mi: "Muña dusa ya bliksa mairin wina tasba pain daukisa.",
      ma: "",
    },
  },
  {
    name: "Orégano (Origanum vulgare)",
    usage: "Estimulación del flujo retenido y alivio de frío pélvico",
    preparation:
      "Infundir media cucharadita en agua hirviendo. Solo para menstruación, prohibido si sospechas de embarazo.",
    scientificNote:
      "Actúa como emenagogo suave y antiinflamatorio. No debe tomarse en el embarazo ya que estimula contracciones uterinas.",
    languages: {
      es: "Oregano",
      mi: "Orégano ya mairin dusa sika kati laka pain bar sa. Bliksa mairin nani bia dikan apia sa.",
      ma: "",
    },
  },
];
*/
