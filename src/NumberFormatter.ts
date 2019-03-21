import {Round} from "./functions";
import {IFormatter} from "./FormatterInterface";
import {LocaleManager} from "./LocaleManager";
import {CURRENCIES} from "./defaults";

const bts = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];
const units = ['', 'k', 'm', 'b', 't', 'p'];

export const NumberFormatter: IFormatter = (name, value, options, translator, values) => {
	const currency = options['currency'];
	const shrink = options['shrink'];
	const round = options['round'];
	const percent = options['percent'];
	const eng = options['eng'];
	const bytes = options['bytes'];
	const balance = options['balance'];

	if (currency) {
		const cur = (currency === true ? CURRENCIES[LocaleManager.CurrentLocaleConfig['currency']] : (CURRENCIES[currency] || null));
		const fx = (round && round !== true) ? round : cur ? cur.portion : 2;

		const sign = Math.sign(value);
		value = sign * value;

		const price = Round(parseFloat(value), fx);
		let tempPrice = price;
		let symbol = cur.units[0].symbol;

		if (shrink) {
			for (let i = 0; i < cur.units.length; i++) {
				let a = cur.units[i];
				if(tempPrice / a.portion < 10)
					break;
				tempPrice /= a.portion;
				symbol = a.symbol;
			}
			tempPrice = Round(tempPrice, fx);
		}

		let nm = tempPrice.toString();
		let op = '';
		let s = 0;
		const m = nm.length - 1;
		for (let i = m; i > -1; i--) {
			s++;
			const l = m - i;
			const c = nm.charAt(i);
			if (c === '.') {
				s = 0;
				op = LocaleManager.CurrentLocaleConfig['delimiters']['decimal'] + op
			} else {
				op = nm[i] + op;
				if (s >= 3 && i !== 0 && l > fx) {
					op = LocaleManager.CurrentLocaleConfig['delimiters']['thousands'] + op;
					s = 0
				}
			}
		}
		if (balance) {
			op = (sign > 0 ? '+' : sign < 0 ? '-' : '') + op
		}
			return op + ' ' + symbol
	} else if (percent) {
		let fx = (round && round !== true) ? round : 0;
		const a = Round(parseFloat(value) * 100, fx);
		return LocaleManager.IsRtl ? `%${a}` : `${a}%`
	} else if (eng) {
		let fx = (round && round !== true) ? round : 2;

		let i = 0;
		let m = 1000;
		let r = Math.abs(value);
		while (r > m) {
			r = r / m;
			i++
		}
		return Round(r, fx) + units[i]

	} else if (bytes) {
		let fx = (round && round !== true) ? round : 1;

		let i = 0;
		let m = 1024;
		let r = Math.abs(value);
		while (r > m) {
			r = r / m;
			i++
		}
		return Round(r, fx * (i > 0 ? 1 : 0)) + bts[i]

	} else {
		return value
	}
};
