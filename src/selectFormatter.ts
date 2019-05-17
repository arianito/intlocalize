export function selectFormatter(name, value, options, translator, values) {
  return translator(options[value], {
    value,
    name,
    ...values,
  });
}
