function jsonParse<T>(str: string) {
  try {
    return JSON.parse(str) as T
  } catch (e) {
    return undefined as unknown as T
  }
}

export default jsonParse
