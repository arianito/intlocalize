import { roundNumber } from './functions';

export const Millisecond = 1;
export const Second = 1000 * Millisecond;
export const Minute = 60 * Second;
export const Hour = 60 * Minute;
export const Day = 24 * Hour;

function div(a, b) {
  return ~~(a / b);
}

function mod(a, b) {
  return a - ~~(a / b) * b;
}

export class Period {
  static calculate(d: number) {
    const Microsecond = Millisecond / 1000;

    let u = d;
    const neg = d < 0;
    if (neg) {
      u = -u;
    }
    let b = '';
    if (u < Second) {
      let prec = 0;
      b = `s${b}`;
      if (u === 0) {
        return '0s';
      }
      if (u < Microsecond) {
        prec = 0;
        b = `n${b}`;
      } else if (u < Millisecond) {
        prec = 3;
        b = `µ${b}`;
      } else {
        prec = 6;
        b = `m${b}`;
      }
      b = roundNumber(u / Math.pow(10, prec), 3) + b;
    } else {
      u = u / Math.pow(10, 9);
      b = `${roundNumber(u % 60, 3)}s${b}`;
      u = div(u, 60);
      if (u > 0) {
        b = `${mod(u, 60)}m${b}`;
        u = div(u, 60);
        if (u > 0) {
          b = `${u}h${b}`;
        }
      }
    }

    if (neg) {
      b = `-${b}`;
    }

    return b;
  }
}
