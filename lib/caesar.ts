/**
 * Cifra un texto usando el cifrado César
 * @param text Texto a cifrar
 * @param shift Número de posiciones a desplazar (0-25)
 * @returns Texto cifrado
 */
export function caesarEncrypt(text: string, shift: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const normalizedShift = shift % 26;
  
  let result = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i].toUpperCase();
    
    if (char.match(/[A-Z]/)) {
      const textPos = alphabet.indexOf(char);
      const encryptedPos = (textPos + normalizedShift) % 26;
      result += alphabet[encryptedPos];
    } else {
      // Mantener espacios y otros caracteres
      result += text[i];
    }
  }
  
  return result;
}

/**
 * Descifra un texto usando el cifrado César
 * @param ciphertext Texto cifrado
 * @param shift Número de posiciones que se desplazó (0-25)
 * @returns Texto descifrado
 */
export function caesarDecrypt(ciphertext: string, shift: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const normalizedShift = shift % 26;
  
  let result = '';
  
  for (let i = 0; i < ciphertext.length; i++) {
    const char = ciphertext[i].toUpperCase();
    
    if (char.match(/[A-Z]/)) {
      const cipherPos = alphabet.indexOf(char);
      const decryptedPos = (cipherPos - normalizedShift + 26) % 26;
      result += alphabet[decryptedPos];
    } else {
      // Mantener espacios y otros caracteres
      result += ciphertext[i];
    }
  }
  
  return result;
}

