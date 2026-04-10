import type { ParseResult } from "./Tokens";
import { BaseToken } from "./BaseToken";

export class NumberToken extends BaseToken {
	public readonly value: number;
	private constructor(value: number | string, position: number) {
		super(String(value), position);
		this.value = typeof value == "number" ? value : parseInt(value);
	}

	public static parse(sentence: string, position: number): ParseResult {
		const matches = /^(\d+)/.exec(sentence);
		if (matches == null) return false;

		return {
			token: new NumberToken(matches[1]!, position),
			tokenLength: matches[1]!.length,
		};
	}
}