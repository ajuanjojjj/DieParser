import type { GroupToken } from "./GroupToken";
import { DieRollToken } from "./DieRoll";
import { NumberToken } from "./NumberToken";
import { OperatorToken } from "./Operator";

export type Token = OperatorToken | NumberToken | DieRollToken | GroupToken;


export function tryParse(sentence: string, position: number): ParseResult {
	let parsed;
	parsed = OperatorToken.parse(sentence, position);
	if (parsed) return parsed;
	parsed = DieRollToken.parse(sentence, position);
	if (parsed) return parsed;

	return NumberToken.parse(sentence, position);
}
export type ParseResult = {
	token: Token;
	tokenLength: number;
} | false;