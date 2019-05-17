import * as React from 'react';
import { parsePseudo, parseOptions } from './pseudoParser';
import { convertNumbers } from './convertNumbers';
import { Intlocalize } from './Intlocalize';
import { formatterBucket } from './formatterBucket';
import { parseTranslationBlock } from './parseTranslationBlock';

export function translateReact(element) {
  return function (...rest) {
    const text = arguments[0];
    const ex = parsePseudo(text, parseTranslationBlock);
    let x = 0;
    const str = Intlocalize.simpleTranslate(ex.key);
    let start = 0;
    let end = 0;
    let open = false;
    let j = 0;
    let next = 0;
    const out = [];
    let z = 0;
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
          out.push(
            React.createElement(element, { key: `item${z}` },
              convertNumbers(str.substring(next, start))),
          );
          z += 1;
          const key = str.substring(start + 1, end - 1);
          const values = typeof arguments[1] === 'object' && arguments[1];
          let value = values && values[op.name] ? values[op.name] : undefined;
          if (!value && value !== 0 && value !== '' && typeof arguments[1] !== 'object') {
            value = arguments[parseInt(key, 10) + 1];
          }
          if (value === 0 || value === '' || value) {
            if (op.name && !op.format) {
              // value.props = {...value.props, key: 'item'+(z++)};
              // value.key = 'item'+(z++);
              if (value.type) {
                out.push(React.createElement(value.type, {
                  ...value.props,
                  key: `item${z}`,
                }, value.props && value.props.children));
                z += 1;
              } else {
                out.push(React.createElement(element, { key: `item${z}` }, value));
                z += 1;
              }
            } else if (op.name && op.format) {
              const options = parseOptions(op.options, values);
              const b = formatterBucket[op.format](op.name, value, options,
                translateReact(element), values);
              out.push(React.createElement(element, { key: `item${z}` }, b));
              z += 1;

            }
          } else {
            out.push('?');
          }
          next = end;
          x += 1;
        }
      }
    }
    out.push(React.createElement(element, { key: `item${z}` },
      convertNumbers(str.substring(next, str.length))));
    return out;
  };
}
