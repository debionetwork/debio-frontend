export default function referenceFormater(id) {
  return `${id.slice(0, 4)}...${id.slice(-4)}`
}
