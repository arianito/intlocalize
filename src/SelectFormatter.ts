import {IFormatter} from "./FormatterInterface";

export const SelectFormatter: IFormatter = (name, value, options, translator, values) => {
	return translator(options[value], {
		value,
		name,
		...values,
	})
};
