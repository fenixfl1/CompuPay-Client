export const states: Record<string, { label: string; color: string }> = {
  A: { label: "Activo", color: "green" },
  I: { label: "Inactivo", color: "gray" },
  D: { label: "Despedido", color: "black" },
  R: { label: "Renunciado", color: "black" },
  P: { label: "Pendiente", color: "blue" },
  E: { label: "Evaluado", color: "orange" },
  J: { label: "Rechazado", color: "red" },
}

export const priorities: Record<string, { label: string; color: string }> = {
  H: { label: "Alta", color: "#ff4d4f" },
  M: { label: "Media", color: "#ffa940" },
  L: { label: "Baja", color: "#73d13d" },
}
