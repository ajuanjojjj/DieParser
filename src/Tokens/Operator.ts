import type { ParseResult } from "./Tokens";
import type { NumberToken } from "./NumberToken";
import { BaseToken } from "./BaseToken";

export class OperatorToken extends BaseToken {
	public value: "+" | "-" | "*" | "/";

	private constructor(representation: "+" | "-" | "*" | "/", position: number) {
		super(representation, position);
		this.value = representation;
	}

	public operate(val1: number | NumberToken, val2: number | NumberToken): number {
		const number1 = typeof val1 == "number" ? val1 : val1.value;
		const number2 = typeof val2 == "number" ? val2 : val2.value;

		switch (this.value) {
			case "+": return number1 + number2;
			case "-": return number1 - number2;
			case "*": return number1 * number2;
			case "/": return number1 / number2;
		}
	}
	public static parse(sentence: string, position: number): ParseResult {
		const matches = /^([\+ \- \*·×x \/÷])/u.exec(sentence);
		if (matches == null) return false;

		let op: "+" | "-" | "*" | "/";
		switch (matches[1]) {
			case "+": op = "+"; break;
			case "-": op = "-"; break;
			case "*":
			case "·":
			case "x":
			case "×": op = "*"; break;
			case "/":
			case "÷": op = "/"; break;
			default: throw new Error("unknown operator: " + matches[1]);
		}

		return {
			token: new OperatorToken(op, position),
			tokenLength: matches[1]!.length,
		};
	}
}