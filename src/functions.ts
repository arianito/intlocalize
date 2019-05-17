// replaceString all occurrences in string
export function replaceString(str: string, search: string, replacement: string) {
  return str.replace(new RegExp(search, 'g'), replacement);
}

// round a number with precision
export function roundNumber(num: number, d: number) {
  const a = Math.pow(10, d);
  return Math.round(num * a) / a;
}
