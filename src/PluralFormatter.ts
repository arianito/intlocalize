import {IFormatter} from "./FormatterInterface";
import {LocaleManager} from "./LocaleManager";

export const PluralFormatter: IFormatter = (name, value, options, translator, values) => {
	const list = Object.keys(options);
	for (let i = 0; i < list.length; i++) {
		const key = list[i];
		if (key.startsWith('=')) {
			if (value == key.substring(1)) {
				return translator(options[key], {
					value, name,
					...values,
				})
			}
		}
	}
	const fnd = options[LocaleManager.GetPluralKey(value)];
	if (fnd) {
		return translator(fnd, {
			value, name,
			...values,
		})
	}
	return '?'
};
