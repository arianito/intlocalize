import {ToPersianLocally} from "./Persian";
import {IFormatter} from "./FormatterInterface";
import {LocaleManager} from "./LocaleManager";
import {Period} from "./Period";

const dms = [60, 60, 24, 30, 12, 365];

function div(a, b) {
	return ~~(a / b)
}

function mod(a, b) {
	return a - ~~(a / b) * b
}

export function dec(d): any[] {

	let pt = [];
	let acc = div(d, 1000);
	for (let i = 0; i < dms.length; i++) {
		pt[i] = mod(acc, dms[i]);
		acc = div(acc, dms[i]);
	}

	let k = 0;
	for (k = pt.length - 1; k >= 0; k--) {
		if (pt[k] !== 0) {
			break
		}
	}
	return [pt, k]
}


export const DateFormatter: IFormatter = (name, value, options, translator, values) => {

	const relative = options['relative'];
	const duration = options['duration'];
	const format = options['format'];
	const time = options['time'];
	const datetime = options['datetime'];
	if (relative) {
		const date = typeof value == 'number' ? value : Date.parse(value);
		const now = Date.now();
		const d = date - now;
		const sign = Math.sign(d);
		const dx = dec(Math.abs(d));
		const idx = dx[1];
		const a = dx[0][idx];
		const dmn = ['second', 'minute', 'hour', 'day', 'month', 'year'];

		try {
			return translator(LocaleManager.CurrentLocaleConfig['fields'][dmn[dx[1]]]['relativeTime'][sign > 0 ? 'future' : 'past'][LocaleManager.GetPluralKey(a)], a)
		} catch (e) {
			return sign > 0 ? 'in ' + a + ' ' + dmn[dx[1]] : a + ' ' + dmn[dx[1]] + ' ago';
		}
	} else if (duration) {
		return Period.calculate(value)
	} else {
		let date = typeof value == 'number' ? new Date(value) : new Date(Date.parse(value));
		let cv = null;
		const gy = date.getUTCFullYear();
		const gm = date.getUTCMonth() + 1;
		const gd = date.getDate();

		let hh = date.getUTCHours();
		let hm = date.getUTCMinutes();
		let hs = date.getUTCSeconds();

		if (format === 'persian') {
			cv = ToPersianLocally(gy, gm, gd)
		} else {
			cv = {
				jy: gy,
				jm: gm,
				jd: gd,
			}
		}

		if (datetime) {
			return `${cv.jy}-${cv.jm}-${cv.jd}T${hh}:${hm}:${hs}`

		}
		if (time) {
			return `${hh}:${hm}:${hs}`

		} else {
			return `${cv.jy}-${cv.jm}-${cv.jd}`
		}

	}
};
