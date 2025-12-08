/**
 * Cifra un texto usando el cifrado Pigpen
 * Con la fuente "Pigpen HHXX", las letras normales se renderizan como símbolos Pigpen
 * @param text Texto a cifrar
 * @returns Texto en mayúsculas (la fuente lo convertirá visualmente)
 */
export function pigpenEncrypt(text: string): string {
  // Con la fuente Pigpen HHXX, solo necesitamos convertir a mayúsculas
  // La fuente se encargará de mostrar los símbolos Pigpen
  return text.toUpperCase();
}

/**
 * Obtiene el símbolo Pigpen para una letra específica
 * @param letter Letra (A-Z)
 * @returns La misma letra (la fuente la renderiza como Pigpen)
 */
export function getPigpenSymbol(letter: string): string {
  return letter.toUpperCase();
}

