const replaceAccentedVowels = (str: string): string => {
  const accents: Record<string, string> = {
    á: "a",
    é: "e",
    í: "i",
    ó: "o",
    ú: "u",
    Á: "A",
    É: "E",
    Í: "I",
    Ó: "O",
    Ú: "U",
  }
  return str?.replace(/[áéíóúÁÉÍÓÚ]/g, (match) => accents[match])
}

export default replaceAccentedVowels
