const fs = require('fs');
const path = require('path');
const utils = require('loader-utils');
const locale = require('./pseudoParser');
const parser = require('./parseTranslationBlock');

const regex = /((__\('(.*?)'([),]))|(__\("(.*?)"([),]))|(__="(.*?)"[ \/]?))/g;
const localeRegex = /(Intlocalize\.loadData)\('(.*?)',/g;

let initialize = false;
export let locales = [];
export let keys = [];
let localesPath = null;

function readLocale(name) {
  try {
    const read = fs.readFileSync(path.join(localesPath, `${name}.json`)).toString('utf8');
    return JSON.parse(read);
  } catch (e) {
    return {
      locale: name,
      messages: {},
    };
  }
}

function saveLocale(name, locale) {
  const content = JSON.stringify(locale, null, 2);
  fs.writeFileSync(path.join(localesPath, `${name}.json`), content);
}

function testMatch(x = '') {
  let input = x;
  if (input.length < 6) {
    return null;
  }
  input = input.trim().substr(4);
  let j = 0;
  for (let i = input.length - 1; i >= 0; i -= 1) {
    if (input.charAt(i) === '\'' || input.charAt(i) === '"') {
      j = i;
      break;
    }
  }
  return input.substring(0, j).trim();
}

export function extractData(src) {
  const source = src.replace(/^\s*[\r\n]/gm, '');
  const array = source.split('\n');
  array.forEach((line) => {
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
        if (key) {
          const x = locale.parsePseudo(key, parser.parseTranslationBlock);
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

    this._compiler.hooks.afterCompile.tap('MyPlugin', () => {
      locales.forEach((lc) => {
        const locale = readLocale(lc);
        locale.messages = keys.reduce((output, key: string) => {
          const index = key.indexOf(':') + 1;
          return Object.assign(output, {
            [key]: locale.messages[key] || key.substring(index) || '',
          });
        }, {});
        saveLocale(lc, locale);
      });
    });
    initialize = true;
  }
  return extractData(source);
}
