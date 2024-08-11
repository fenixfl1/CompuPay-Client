export default function randomHexColorCode(
  omitColors = ["#000000", "#ffffff"]
) {
  const omitSet = new Set(omitColors)
  let color
  do {
    color = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
  } while (omitSet.has(`#${color}`))
  return `#${color}`
}
