const fs = require('fs');
const path = require('path');
const utils = require('loader-utils');
const locale = require('./PseudoParser');
const parser = require('./ParseTranslationBlock');

const regex = /((__\('(.*?)'([),]))|(__\("(.*?)"([),]))|(__="(.*?)"[ \/]?))/g;
const localeRegex = /(LocaleManager\.LoadLocale)\('(.*?)',/g;

let initialize = false;
export let locales = [];
export let keys = [];
let localesPath = null;
let extension = null;

function readLocale(name) {
	try {
		let read = fs.readFileSync(path.join(localesPath, name + extension)).toString('utf8').trim();
		read = read.substr(read.indexOf('{'));
		read = read.substr(0, read.length-1);
		return JSON.parse(read)
	} catch (e) {
		return {
			locale: name,
			messages: {},
		};
	}
}

function saveLocale(name, locale) {
	const str = 'export const MESSAGES_' + name.toUpperCase() + ' = ';
	const content = str + JSON.stringify(locale, null, 4) + ';';
	fs.writeFileSync(path.join(localesPath, name + extension), content)
}


function testMatch(input = '') {
	if (input.length < 6)
		return null;
	input = input.trim().substr(4);
	let j = 0;
	for (let i = input.length - 1; i >= 0; i--) {
		if (input.charAt(i) === "'" || input.charAt(i) === '"') {
			j = i;
			break;
		}
	}
	return input.substring(0, j).trim()
}


export function extractData(source) {
	source = source.replace(/^\s*[\r\n]/gm, "");
	const array = source.split("\n");
	array.forEach(line => {
		let m;
		do {
			m = localeRegex.exec(line);
			if (m) {
				const key = m[2];
				if (key && !locales.includes(key)) {
					locales.push(key);
				}
			}
		} while (m);

		let match;
		do {
			match = regex.exec(line);
			if (match) {
				const key = testMatch(match[0]);
				if(key) {
					const x = locale.ParsePseudo(key, parser.ParseTranslationBlock);
					if (!keys.includes(x.key) && x.key.length > 3) {
						keys.push(x.key);
					}
				}
			}
		} while (match);
	});
	return source;
}
export default function loader(source) {
	if (!initialize) {
		const options = Object.assign(
			{},
			utils.getOptions(this),
		);
		localesPath = options['localesPath'];
		extension = options['extension'] || '.ts';

		this._compiler.hooks.afterCompile.tap('MyPlugin', function () {
			locales.forEach(lc => {
				const locale = readLocale(lc);
				locale.messages = keys.reduce((output, key: string) => {
					const index = key.indexOf(':') + 1;
					return Object.assign(output, {
						[key]: locale.messages[key] || key.substring(index) || '',
					})
				}, {});
				saveLocale(lc, locale);
			})
		});
		initialize = true;
	}
	return extractData(source)
}
