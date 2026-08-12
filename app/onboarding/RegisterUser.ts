// Importamos el repositorio de usuarios.
import { getUserRepository } from "@/storage/database/repositories/UserRepository";

// Importamos el repositorio de configuración.
import { getUserSettingsRepository } from "@/storage/database/repositories/UserSettingsRepository";

// Definimos la información recibida
// desde RegisterScreen.
export interface RegisterUserInput {
  // Nombre introducido por la usuaria.
  name: string;

  // Código del idioma seleccionado.
  language: string;

  // Etapa seleccionada.
  stage: string;

  // Duración habitual del ciclo.
  cycleLength?: number;
}

// Definimos la respuesta del registro.
export interface RegisterUserResult {
  // ID generado por SQLite.
  userId: number;

  // Nombre almacenado.
  displayName: string;

  // Idioma almacenado.
  languageCode: string;

  // Etapa almacenada.
  stageCode: string;
}

// Función principal del caso de uso.
// Esta función coordina todo el proceso de registro.
export async function registerUser(
  input: RegisterUserInput,
): Promise<RegisterUserResult> {
  // Obtenemos el repositorio de usuarios.
  const userRepository = await getUserRepository();

  // Obtenemos el repositorio de configuración.
  const settingsRepository = await getUserSettingsRepository();

  // Creamos la usuaria en SQLite.
  const user = await userRepository.create({
    displayName: input.name,
    languageCode: input.language,
    stageCode: input.stage,
  });

  // Determinamos la duración del ciclo.
  // Si estamos en menstruación usamos el valor enviado.
  // En cualquier otro caso utilizamos 28 como valor inicial.
  const averageCycleLength =
    input.stage === "menstruation" ? (input.cycleLength ?? 28) : 28;

  // Creamos la configuración inicial
  // relacionada con el usuario recién creado.
  await settingsRepository.create({
    userId: user.id,
    averageCycleLength,
    averagePeriodLength: 5,
  });

  // Devolvemos los datos fundamentales
  // para que AppContext pueda actualizar su estado.
  return {
    userId: user.id,
    displayName: user.displayName,
    languageCode: user.languageCode,
    stageCode: user.stageCode,
  };
}
