export function fmtSpecimenNumber(specimenNumber) {
  const first = specimenNumber.substring(0, 4)
  const second = specimenNumber.substring(3, 8)
  const third = specimenNumber.substring(7)
  
  return `${first}-${second}-${third}`
}
