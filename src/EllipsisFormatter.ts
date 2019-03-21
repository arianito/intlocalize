import {IFormatter} from "./FormatterInterface";

export const EllipsisFormatter: IFormatter = (name, value, options) =>{
	const max = options['max'];
	if (value.length < max) {
		return value
	}
	return value.slice(0, max) + '...'
};
