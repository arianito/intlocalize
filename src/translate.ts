import { parsePseudo, parseOptions } from './pseudoParser';
import { convertNumbers } from './convertNumbers';
import { Intlocalize } from './Intlocalize';
import { formatterBucket } from './formatterBucket';
import { parseTranslationBlock } from './parseTranslationBlock';

// tslint:disable-next-line:function-name
export function __(...rest) {
  const text = arguments[0];
  const ex = parsePseudo(text, parseTranslationBlock);

  let x = 0;
  const str = Intlocalize.simpleTranslate(ex.key);

  let start = 0;
  let end = 0;
  let open = false;
  let j = 0;
  let next = 0;
  let out = '';
  for (let i = 0; i < str.length; i += 1) {
    if (str.charAt(i) === '{') {
      if (!open) {
        start = i;
        open = true;
        j = 0;
      }
      j += 1;
    } else if (str.charAt(i) === '}') {
      j -= 1;
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
          value = arguments[parseInt(key, 10) + 1];
        }
        if (value === 0 || value === '' || value) {
          if (op.name && !op.format) {
            out += value;
          } else if (op.name && op.format) {
            const options = parseOptions(op.options, values);
            out += formatterBucket[op.format](op.name, value, options, __, values);
          }
        } else {
          out += '?';
        }
        next = end;
        x += 1;
      }
    }
  }
  out += str.substring(next, str.length);
  return convertNumbers(out);
}
