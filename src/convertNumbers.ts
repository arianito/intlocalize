import { replaceString } from './functions';
import { Intlocalize } from './Intlocalize';
import { ENG_TO_AR } from './defaults/engtoar';
import { ENG_TO_FA } from './defaults/engtofa';
import { FA_TO_ENG } from './defaults/fatoeng';


export function convertNumbers(raw, lang = Intlocalize.locale) {
  let str = raw;
  if (lang === 'fa') {
    Object.keys(ENG_TO_FA).forEach((key) => {
      str = replaceString(str, key, ENG_TO_FA[key]);
    });
    return str;
  }
  if (lang === 'ar') {
    Object.keys(ENG_TO_AR).forEach((key) => {
      str = replaceString(str, key, ENG_TO_AR[key]);
    });
    return str;
  }
  Object.keys(FA_TO_ENG).forEach((key) => {
    str = replaceString(str, key, FA_TO_ENG[key]);
  });
  return str;
}
