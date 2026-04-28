export function execute(deepTokens: BasicToken[]): number | BasicToken[] {
	if ((deepTokens.length % 2) != 1) throw new Error("Odd number of tokens, cannot parse");

	const flattened = [];
	let foundArray = false;
	for (const token of deepTokens) {
		if (Array.isArray(token)) {
			flattened.push(execute(token));
			foundArray = true;
		} else {
			flattened.push(token);
		}
	}
	if (foundArray) return flattened;

	// First, multiplications and divisions.
	const result = [flattened[0]!];
	for (let i = 1; i < flattened.length; i += 2) {
		const token = flattened[i];
		const nextToken = flattened[i + 1] as number;
		if (typeof token == "number") throw new Error("Found a number where an operator was expected");

		if (token == "+") { result.push(token, nextToken); continue; }
		if (token == "-") { result.push(token, nextToken); continue; }
		if (token == "*") { result.push((result.pop() as number) * nextToken); continue; }
		if (token == "/") { result.push((result.pop() as number) / nextToken); continue; }

		throw new Error("Unknown token");
	}

	let value = result[0] as number;
	for (let i = 1; i < result.length; i += 2) {
		const token = result[i];
		const nextToken = result[i + 1] as number;
		if (typeof token == "number") throw new Error("Found a number where an operator was expected");

		if (token == "+") { value += nextToken; continue; }
		if (token == "-") { value -= nextToken; continue; }
		if (token == "*") throw new Error("Found a multiplication, but there should be none left?");
		if (token == "/") throw new Error("Found a division, but there should be none left?");

		throw new Error("Unknown token");
	}

	return value;
}


export type BasicToken = number | string | BasicToken[];


export function stringifyTokens(tokens: BasicToken[]): string {
	return tokens.map(token => {
		if (typeof token == "number") return token.toString();
		if (typeof token == "string") return token;
		return `(${stringifyTokens(token)})`;
	}).join(" ");
}