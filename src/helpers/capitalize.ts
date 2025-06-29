export function capitalizeString(text: string) {
  return text.replace(/\b\w/g, (char) => char.toUpperCase())
}
