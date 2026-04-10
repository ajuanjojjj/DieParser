import type { Token } from "./Tokens";
import { BaseToken } from "./BaseToken";

export class GroupToken extends BaseToken {
	public readonly tokens: Array<Token> = [];

	public push(token: Token) {
		this.tokens.push(token);
	}

	public stringify(): string {
		return this.tokens.map(t => {
			if (t instanceof GroupToken) return `(${t.stringify()})`;
			return t.representation;
		}).join(" ");
	}
}