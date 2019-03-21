import * as React from 'react'
import {ParsePseudo, ParseOptions} from "./PseudoParser";
import {ConvertNumbers} from "./ConvertNumbers";
import {LocaleManager} from "./LocaleManager";
import {FormatterBucket} from "./Formatter";
import {ParseTranslationBlock} from "./ParseTranslationBlock";


export function TranslateReact(element) {
	return function (...rest) {
		const text = arguments[0];
		const ex = ParsePseudo(text, ParseTranslationBlock);
		let x = 0;
		const str = LocaleManager.SimpleTranslate(ex.key);
		let start = 0;
		let end = 0;
		let open = false;
		let j = 0;
		let next = 0;
		let out = [];
		let z = 0;
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

					out.push(React.createElement(element, {key: 'item' + (z++)}, ConvertNumbers(str.substring(next, start))));
					const key = str.substring(start + 1, end - 1);
					const values = typeof arguments[1] === 'object' && arguments[1];
					let value = values && values[op.name] ? values[op.name] : undefined;
					if (!value && value !== 0 && value !== '' && typeof arguments[1] !== 'object') {
						value = arguments[parseInt(key) + 1];
					}
					if (value === 0 || value === '' || value) {
						if (op.name && !op.format) {
							// value.props = {...value.props, key: 'item'+(z++)};
							// value.key = 'item'+(z++);
							if (value.type) {
								out.push(React.createElement(value.type, {
									...value.props,
									key: 'item' + (z++)
								}, value.props && value.props.children))
							} else {
								out.push(React.createElement(element, {key: 'item' + (z++)}, value))
							}
						} else if (op.name && op.format) {
							let options = ParseOptions(op.options, values);
							const b = FormatterBucket[op.format](op.name, value, options, TranslateReact(element), values);
							out.push(React.createElement(element, {key: 'item' + (z++)}, b))

						}
					} else {
						out.push('?');
					}
					next = end;
					x++
				}
			}
		}
		out.push(React.createElement(element, {key: 'item' + z}, ConvertNumbers(str.substring(next, str.length))));
		return out
	}
}
