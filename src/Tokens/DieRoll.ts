import type { ParseResult } from "./Tokens";
import { BaseToken } from "./BaseToken";

export class DieRollToken extends BaseToken {
	public readonly count: number;
	public readonly sides: number;

	private constructor(representation: string, position: number) {
		super(representation, position);
		const matches = /^(\d*)d(\d+)$/.exec(representation);
		if (matches == null) throw new SyntaxError("Invalid DieRoll representation: " + representation);

		const count = matches[1] == "" ? 1 : parseInt(matches[1]!);
		const sides = parseInt(matches[2]!);

		if (sides == 0) throw new Error("Number of sides must be greater than 0.");

		this.sides = sides;
		this.count = count;
	}

	public static parse(sentence: string, position: number): ParseResult {
		const matches = /^(\d*d\d+)/.exec(sentence);
		if (matches == null) return false;

		return {
			token: new DieRollToken(matches[1]!, position),
			tokenLength: matches[1]!.length
		};
	}

	public rollDies() {
		const dies = new Array();
		dies.push(this.rollSingleDie());
		for (let i = 1; i < this.count; i++) {
			dies.push("+");
			dies.push(this.rollSingleDie());
		}
		return dies;
	}

	public rollValue() {
		let value = this.rollSingleDie();
		for (let i = 1; i < this.count; i++) {
			value += this.rollSingleDie();
		}
		return value;
	}

	private rollSingleDie() {
		return Math.floor(Math.random() * this.sides) + 1;
	}
}