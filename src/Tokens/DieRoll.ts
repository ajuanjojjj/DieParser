import type { ParseResult } from "./Tokens";
import { BaseToken } from "./BaseToken";

export class DieRollToken extends BaseToken {
	public readonly count: number;
	public readonly sides: number;

	private constructor(representation: string, position: number) {
		super(representation, position);
		const matches = /^(\d*)d(\d+)$/.exec(representation);
		if (matches == null) throw new SyntaxError("Invalid DieRoll representation: " + representation);

		const count = matches[1] == "" ? "1" : matches[1];
		const sides = matches[2];

		if (sides == "0") throw new Error("Number of sides must be greater than 0.");

		this.sides = parseInt(sides!);
		this.count = parseInt(count!);
	}

	public static parse(sentence: string, position: number): ParseResult {
		const matches = /^(\d*d\d+)/.exec(sentence);
		if (matches == null) return false;

		return {
			token: new DieRollToken(matches[1]!, position),
			tokenLength: matches[1]!.length
		};
	}

	public get value() {
		let total = 0;
		for (let i = 0; i < this.count; i++) {
			total += Math.floor(Math.random() * this.sides) + 1;
		}
		return total;
	}
}