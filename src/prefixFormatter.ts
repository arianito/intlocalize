function charPrefix(s, n, c = '0') {
  let o = s;
  while (o.length < n) {
    o = c + o;
  }
  return o;
}

export function prefixFormatter(name, value, options) {
  const zero = options['zero'];
  if (zero) {
    return charPrefix(value.toString(), zero);
  }
  return value;
}
