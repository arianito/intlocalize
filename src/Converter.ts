function jalCal(jy) {
  const breaks = [-61, 9, 38, 199, 426, 686,
    756, 818, 1111, 1181, 1210, 1635, 2060,
    2097, 2192, 2262, 2324, 2394, 2456, 3178,
  ];
  const bl = breaks.length;
  const gy = jy + 621;
  let leapJ = -14;
  let jp = breaks[0];
  let jm;
  let jump;
  let leap;
  let leapG;
  let march;
  let n;
  let i;

  if (jy < jp || jy >= breaks[bl - 1]) {
    throw new Error(`Invalid Jalaali year ${jy}`);
  }

  for (i = 1; i < bl; i += 1) {
    jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) {
      break;
    }
    leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
    jp = jm;
  }
  n = jy - jp;

  leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
  if (mod(jump, 33) === 4 && jump - n === 4) {
    leapJ += 1;
  }

  leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;

  march = 20 + leapJ - leapG;

  if (jump - n < 6) {
    n = n - jump + div(jump + 4, 33) * 33;
  }
  leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) {
    leap = 4;
  }

  return {
    leap,
    gy,
    march,
  };
}

function j2d(jy, jm, jd) {
  const r = jalCal(jy);
  return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
}

function d2j(jdn) {
  const gy = d2g(jdn).gy;
  let jy = gy - 621;
  const r = jalCal(jy);
  const jdn1f = g2d(gy, 3, r.march);
  let jd;
  let jm;
  let k;

  k = jdn - jdn1f;
  if (k >= 0) {
    if (k <= 185) {
      jm = 1 + div(k, 31);
      jd = mod(k, 31) + 1;
      return {
        jy
        , jm
        , jd,
      };
    }
    k -= 186;
  } else {
    jy -= 1;
    k += 179;
    if (r.leap === 1) {
      k += 1;
    }
  }
  jm = 7 + div(k, 30);
  jd = mod(k, 30) + 1;
  return {
    jy, jm, jd,
  };
}

function g2d(gy, gm, gd) {
  let d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
    + div(153 * mod(gm + 9, 12) + 2, 5)
    + gd - 34840408;
  d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
  return d;
}

function d2g(jdn) {
  let j;
  let i;
  let gd;
  let gm;
  let gy;
  j = 4 * jdn + 139361631;
  j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
  i = div(mod(j, 1461), 4) * 5 + 308;
  gd = div(mod(i, 153), 5) + 1;
  gm = mod(div(i, 153), 12) + 1;
  gy = div(j, 1461) - 100100 + div(8 - gm, 6);
  return {
    gy, gm, gd,
  };
}

function localToGregorian(jy, jm, jd) {
  return d2g(j2d(jy, jm, jd));
}

function div(a, b) {
  return ~~(a / b);
}

function mod(a, b) {
  return a - ~~(a / b) * b;
}

export class Converter {
  static toPersianLocally(gy, gm, gd) {
    return d2j(g2d(gy, gm, gd));
  }

  static isValidPersianDate(jy, jm, jd) {
    return jy >= -61 && jy <= 3177 &&
      jm >= 1 && jm <= 12 &&
      jd >= 1 && jd <= this.persianMonthLength(jy, jm);
  }

  static leapYear(jy) {
    return jalCal(jy).leap === 0;
  }

  static persianMonthLength(jy, jm) {
    if (jm <= 6) {
      return 31;
    }
    if (jm <= 11) {
      return 30;
    }
    if (this.leapYear(jy)) {
      return 30;
    }
    return 29;
  }

  static gregorianMonthLength(gy: number, gm: number) {
    return new Date(gy, gm, 0).getDate();
  }

  static toGregorian(jy, jm, jd) {
    const a = localToGregorian(jy, jm, jd);
    return new Date(a.gy, a.gm - 1, a.gd, 0, 0, 0, 0);
  }

  static fromGregorian(gy, gm, gd) {
    const a = this.toPersianLocally(gy, gm, gd);
    return [a.jy, a.jm, a.jd];
  }

  static toPersian(date) {
    let a = date;
    if (typeof a === 'number') {
      a = new Date(a);
    }
    const gy = a.getUTCFullYear();
    const gm = a.getUTCMonth() + 1;
    const gd = a.getUTCDate();

    a = this.toPersianLocally(gy, gm, gd);
    return [a.jy, a.jm, a.jd];
  }

}
