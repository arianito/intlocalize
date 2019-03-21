
// ReplaceString all occurrences in string
export function ReplaceString(str: string, search: string, replacement: string) {
	return str.replace(new RegExp(search, 'g'), replacement)
}

// Round a number with precision
export function Round(num: number, d: number) {
	const a = Math.pow(10, d);
	return Math.round(num * a) / a
}
