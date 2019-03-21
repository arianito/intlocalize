
export function ParseTranslationBlock(op) {
	const spl = op.substring(1, op.length -1).split(',').map(a=>a.trim());
	return {name: spl[0], format: spl[1], options: spl[2]}
}
