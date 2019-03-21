import {IFormatter} from "./FormatterInterface";


function charPrefix(s, n, c = '0') {
	let o = s;
	while (o.length < n) {
		o = c + o
	}
	return o
}

export const PrefixFormatter:IFormatter = (name, value, options) =>{
	const zero = options['zero'];
	if (zero) {
		return charPrefix(value.toString(), zero)
	} else {
		return value
	}
};
