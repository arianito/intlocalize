import {PluralFormatter} from "./PluralFormatter";
import {NumberFormatter} from "./NumberFormatter";
import {DateFormatter} from "./DateFormatter";
import {SelectFormatter} from "./SelectFormatter";
import {PrefixFormatter} from "./PrefixFormatter";
import {EllipsisFormatter} from "./EllipsisFormatter";
import {IFormatter} from "./FormatterInterface";

export const FormatterBucket: {[key:string]: IFormatter}  = {
	'plural': PluralFormatter,
	'number': NumberFormatter,
	'date': DateFormatter,
	'select': SelectFormatter,
	'prefix': PrefixFormatter,
	'ellipsis': EllipsisFormatter,
};
