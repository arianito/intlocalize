const fs = require('fs');
const path = require('path');
const utils = require('loader-utils');
const locale = require('./PseudoParser');
const parser = require('./ParseTranslationBlock');

const regex = /((__\('(.*?)'([),]))|(__\("(.*?)"([),]))|(__="(.*?)"([ \/])))/g;
const localeRegex = /(LocaleManager\.LoadLocale)\('(.*?)',/g;

let initialize = false;
let locales = [];
let keys = [];
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
				locale.messages = keys.reduce((output, key) => Object.assign(output, {
					[key]: locale.messages[key] || key,
				}), {});
				saveLocale(lc, locale);
			})
		});
		initialize = true;
	}

	source = source.replace(/^\s*[\r\n]/gm, "");
	const array = source.split("\n");
	array.forEach(line => {
		let m;
		do {
			m = localeRegex.exec(line);
			if (m) {
				const key = m[2];
				if (!locales.includes(key)) {
					locales.push(key);
				}
			}
		} while (m);

		let match;
		do {
			match = regex.exec(line);
			if (match) {
				const x = locale.ParsePseudo(match[3], parser.ParseTranslationBlock);
				if (!keys.includes(x.key)) {
					keys.push(x.key);
				}
			}
		} while (match);
	});
	return source;
}
