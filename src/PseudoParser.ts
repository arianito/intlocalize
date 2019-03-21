function checkN(h, n) {
	return (h == 'n' ? n : h)
}

function comp(lh, op, rh, n) {
	switch (op) {
		case '>':
			return checkN(lh, n) > checkN(rh, n);
		case '<':
			return checkN(lh, n) < checkN(rh, n);
		case '=':
			return checkN(lh, n) == checkN(rh, n)
	}
}

export function MatchExpression(exp, n) {
	const ez = [];
	let nex = 0;
	for (let i = 0; i < exp.length; i++) {
		const c = exp.charAt(i);
		if (c === '<' || c === '>' || c === '=') {
			if (ez.length > 0) {
				ez[ez.length - 1].rh = exp.substring(nex, i)
			}
			ez.push({
				lh: exp.substring(nex, i),
				op: c,
			});
			nex = i + 1
		}
	}
	ez[ez.length - 1].rh = exp.substring(nex, exp.length);
	return ez.every(a => comp(a.lh, a.op, a.rh, n))
}

export function ParsePseudo(str: string, parser: (block: string) => any) {
	let idx = [];
	let out = '';
	let next = 0;
	let start = 0;
	let end = 0;
	let open = false;
	let j = 0;
	let n = 0;
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
				out += str.substring(next, start) + '{' + n + '}';
				const op = str.substring(start, end);
				idx.push(parser(op));
				next = end;
				n++
			}
		}
	}
	out += str.substring(next, str.length);
	return {key: out, options: idx}
}


// parse pseudo block options { {} {} }
export function ParseOptions(str, values = {}) {
	let options = {};
	if (!str) {
		return options
	}

	let start = 0;
	let end = 0;
	let open = false;
	let j = 0;
	let next = 0;
	str = str.trim();

	let ms = 0;
	let mo = false;

	for (let i = 0; i < str.length; i++) {
		const c = str.charAt(i);
		if (c === '@' && !mo) {
			ms = i;
			mo = true
		} else if ((c === ' ' || i == str.length - 1) && mo) {
			next = i + 1;
			const key = str.substring(ms + 1, i + 1).trim();
			options[key] = values[key] || true;
			mo = false
		} else if (c === '{') {
			if (!open) {
				start = i;
				open = true;
				j = 0
			}
			j++
		} else if (c === '}') {
			j--;
			if (open && j === 0) {
				end = i + 1;
				open = false;
				options[str.substring(next, start).trim()] = str.substring(start + 1, end - 1).trim();
				next = end
			}
		}
	}

	return options
}
