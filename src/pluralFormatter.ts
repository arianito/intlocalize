import { Intlocalize } from './Intlocalize';

export function pluralFormatter(name, value, options, translator, values) {
  const list = Object.keys(options);
  for (let i = 0; i < list.length; i+=1) {
    const key = list[i];
    if (key.startsWith('=')) {
      if (value === key.substring(1)) {
        return translator(options[key], {
          value, name,
          ...values,
        });
      }
    }
  }
  const fnd = options[Intlocalize.getPluralKey(value)];
  if (fnd) {
    return translator(fnd, {
      value, name,
      ...values,
    });
  }
  return '?';
}
