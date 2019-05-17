import { roundNumber } from './functions';
import { Intlocalize } from './Intlocalize';
import { CURRENCIES } from './defaults/currencies';

const bts = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];
const units = ['', 'k', 'm', 'b', 't', 'p'];

export function numberFormatter(name, v, options) {
  let value = v;
  const currency = options['currency'];
  const shrink = options['shrink'];
  const round = options['round'];
  const percent = options['percent'];
  const eng = options['eng'];
  const bytes = options['bytes'];
  const balance = options['balance'];

  if (currency) {
    const cur = currency === true ?
      CURRENCIES[Intlocalize.currentData['currency']] :
      (CURRENCIES[currency] || null);
    const fx = (round && round !== true) ? round : cur ? cur.portion : 2;

    const sign = Math.sign(value);
    value = sign * value;

    let tempPrice = roundNumber(parseFloat(value), fx);
    let symbol = cur.units[0].symbol;

    if (shrink) {
      for (let i = 0; i < cur.units.length; i += 1) {
        const a = cur.units[i];
        symbol = a.symbol;
        if (tempPrice / a.portion < 10 && i > 0) {
          symbol = cur.units[i - 1].symbol;
          break;
        }

        tempPrice /= a.portion;
      }
      tempPrice = roundNumber(tempPrice, fx);
    }

    const nm = tempPrice.toString();
    let op = '';
    let s = 0;
    const m = nm.length - 1;
    const deci = Intlocalize.currentData['delimiters']['decimal'];
    const thz = Intlocalize.currentData['delimiters']['thousands'];
    for (let i = m; i > -1; i -= 1) {
      s += 1;
      const l = m - i;
      const c = nm.charAt(i);
      if (c === '.') {
        s = 0;
        op = deci + op;
      } else {
        op = nm[i] + op;
        if (s >= 3 && i !== 0 && l >= fx) {
          op = thz + op;
          s = 0;
        }
      }
    }
    if (balance) {
      op = (sign > 0 ? '+' : sign < 0 ? '-' : '') + op;
    }

    return `${op} ${symbol}`;
  }
  if (percent) {
    const fx = (round && round !== true) ? round : 0;
    const a = roundNumber(parseFloat(value) * 100, fx);
    return Intlocalize.isRtl ? `%${a}` : `${a}%`;
  }
  if (eng) {
    const fx = (round && round !== true) ? round : 2;

    let i = 0;
    const m = 1000;
    let r = Math.abs(value);
    while (r > m) {
      r = r / m;
      i += 1;
    }
    return roundNumber(r, fx) + units[i];

  }
  if (bytes) {
    const fx = (round && round !== true) ? round : 1;

    let i = 0;
    const m = 1024;
    let r = Math.abs(value);
    while (r > m) {
      r = r / m;
      i += 1;
    }
    return roundNumber(r, fx * (i > 0 ? 1 : 0)) + bts[i];

  }
  return value;
}
