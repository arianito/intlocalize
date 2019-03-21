import {ParsePseudo, ParseOptions} from "./PseudoParser";
import {ConvertNumbers} from "./ConvertNumbers";
import {LocaleManager} from "./LocaleManager";
import {FormatterBucket} from "./Formatter";
import {ParseTranslationBlock} from "./ParseTranslationBlock";

export function __(...rest) {
	const text = arguments[0];
	const ex = ParsePseudo(text, ParseTranslationBlock);

	let x = 0;
	const str = LocaleManager.SimpleTranslate(ex.key);

	let start = 0;
	let end = 0;
	let open = false;
	let j = 0;
	let next = 0;
	let out = '';
	for (let i = 0; i < str.length; i++) {
		if (str.charAt(i) === '{') {
			if (!open) {
				start = i;
				open = true;
				j = 0
			}
			j++
		} else if (str.charAt(i) === '}') {
			j--;
			if (open && j === 0) {
				end = i + 1;
				open = false;
				const op = ex.options[x];
				out += str.substring(next, start);
				const key = str.substring(start + 1, end - 1);
				const typeOk = arguments[1] && arguments[1].constructor === {}.constructor;
				const values = typeOk && arguments[1];
				let value = values && values[op.name] ? values[op.name] : undefined;
				if (!value && value !== 0 && value !== '' && !typeOk) {
					value = arguments[parseInt(key) + 1];
				}
				if (value === 0 || value === '' || value) {
					if (op.name && !op.format) {
						out += value
					} else if (op.name && op.format) {
						let options = ParseOptions(op.options, values);
						out += FormatterBucket[op.format](op.name, value, options, __, values)
					}
				} else {
					out += '?'
				}
				next = end;
				x++
			}
		}
	}
	out += str.substring(next, str.length);
	return ConvertNumbers(out)
}
