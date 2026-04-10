import { describe, expect, test } from 'vitest';
import { parse, tokenize } from './Tokenizer';
import { DieRollToken } from "../Tokens/DieRoll";
import { NumberToken } from "../Tokens/NumberToken";
import { OperatorToken } from "../Tokens/Operator";
import { GroupToken } from "../Tokens/GroupToken";

describe("1. Basic Tokens", () => {
	test("Die Roll Token.", () => {
		const token = tokenize("1d20").tokens[0] as DieRollToken;

		expect(token).toBeInstanceOf(DieRollToken);
		expect(token.count).toBe(1);
		expect(token.sides).toBe(20);

		const token2 = tokenize("d6").tokens[0] as DieRollToken;
		expect(token2).toBeInstanceOf(DieRollToken);
		expect(token2.count).toBe(1);
		expect(token2.sides).toBe(6);
	});
	test("Number token.", () => {
		const tokens = tokenize("20").tokens;
		const token = tokens[0] as NumberToken;

		expect(token).toBeInstanceOf(NumberToken);
		expect(token.value).toBe(20);
	});
	test("Addition and Subtraction Tokens.", () => {
		const token1 = tokenize("-").tokens[0] as OperatorToken;
		expect(token1).toBeInstanceOf(OperatorToken);
		expect(token1.value).toBe("-");


		const token2 = tokenize("+").tokens[0] as OperatorToken;
		expect(token2).toBeInstanceOf(OperatorToken);
		expect(token2.value).toBe("+");
	});
	test("Multiplication Token and variations.", () => {
		const token = tokenize("*").tokens[0] as OperatorToken;

		expect(token).toBeInstanceOf(OperatorToken);
		expect(token.value).toBe("*");

		const token2 = tokenize("x").tokens[0] as OperatorToken;
		expect(token2).toBeInstanceOf(OperatorToken);
		expect(token2.value).toBe("*");

		const token3 = tokenize("×").tokens[0] as OperatorToken;
		expect(token3).toBeInstanceOf(OperatorToken);
		expect(token3.value).toBe("*");

		const token4 = tokenize("·").tokens[0] as OperatorToken;
		expect(token4).toBeInstanceOf(OperatorToken);
		expect(token4.value).toBe("*");
	});
	test("Division Token and variations.", () => {
		const token = tokenize("/").tokens[0] as OperatorToken;

		expect(token).toBeInstanceOf(OperatorToken);
		expect(token.value).toBe("/");

		const token2 = tokenize("÷").tokens[0] as OperatorToken;
		expect(token2).toBeInstanceOf(OperatorToken);
		expect(token2.value).toBe("/");
	});
});

describe("2. Parentheses & Grouping", () => {
	test("Multiple tokens", () => {
		const tokens = parse("1d6 + 2").tokens;
		expect(tokens.length).toBe(3);
		expect(tokens[0]).toBeInstanceOf(DieRollToken);
		expect(tokens[1]).toBeInstanceOf(OperatorToken);
		expect(tokens[2]).toBeInstanceOf(NumberToken);
	});
	test("Simple parentheses.", () => {
		const tokens = parse("(1d6 + 2)").tokens;
		expect(tokens.length).toBe(1);

		const group = tokens[0] as GroupToken;
		expect(group).toBeInstanceOf(GroupToken);
		expect(group.tokens.length).toBe(3);
		expect(group.tokens[0]).toBeInstanceOf(DieRollToken);
		expect(group.tokens[1]).toBeInstanceOf(OperatorToken);
		expect(group.tokens[2]).toBeInstanceOf(NumberToken);
	});
	test("Nested parentheses.", () => {
		const tokens = parse("((1d6 + 2) * 3)").tokens;
		expect(tokens.length).toBe(1);
		const group1 = tokens[0] as GroupToken;
		expect(group1).toBeInstanceOf(GroupToken);

		const group2 = group1.tokens[0] as GroupToken;
		expect(group2).toBeInstanceOf(GroupToken);
		expect(group2.tokens.length).toBe(3);
		expect(group2.tokens[0]).toBeInstanceOf(DieRollToken);
		expect(group2.tokens[1]).toBeInstanceOf(OperatorToken);
		expect(group2.tokens[2]).toBeInstanceOf(NumberToken);
	});
});

describe("3. Whitespace & Formatting", () => {
	test("Zero spaces between tokens.", () => {
		const tokens = parse("2d6+3*(1d4-2)").tokens;
		expect(tokens.length).toBe(5);
	});
	test("Arbitrary / excessive spaces.", () => {
		const tokens = parse("  2d6   +   3 * (  1d4 - 2 )  ").tokens;
		expect(tokens.length).toBe(5);
	});
	test("Arbitrary / excessive tabs.", () => {
		const tokens = parse("2d6\t\t+3\t*(\t1d4-2)").tokens;
		expect(tokens.length).toBe(5);
	});
	test("Mixed whitespace characters.", () => {
		const tokens = parse("2d6 \t + 3\t*( 1d4-2)").tokens;
		expect(tokens.length).toBe(5);
	});
});

describe("4. Die Rolls", () => {
	test("Multiple rolls of a single - sided die(always 1).", repeat(50, () => {
		const token = parse("10d1").tokens[0] as DieRollToken;
		expect(token.value).toBe(10);
	}));
	test("High face count and multiple dice.", repeat(50, () => {
		const token = parse("5d100").tokens[0] as DieRollToken;
		expect(token.value).toBeGreaterThan(5);
		expect(token.value).toBeLessThan(500);
	}));
});

describe("5. Syntax Error Handling", () => {
	test("Throw Error: Number of sides must be greater than 0", () => {
		const action = () => parse("1d0");
		expect(action).toThrow("Number of sides must be greater than 0.");
	});
	test("Invalid syntax: unknown token 1dd6", () => {
		const action = () => parse("1dd6");
		expect(action).toThrow("Invalid character 'd' at position 1.");
	});
	test("Invalid syntax: Unclosed parenthesis", () => {
		const action = () => parse("(1d6 + 2");
		expect(action).toThrow("Unclosed parenthesis at position 0.");
	});
	test("Invalid syntax: Unexpected closing parenthesis", () => {
		const action = () => parse("1d6 + 2)");
		expect(action).toThrow("Unexpected closing parenthesis at position 7.");
	});
	test("Invalid syntax: Non-integer dice faces", () => {
		const action = () => parse("2d6.5");
		expect(action).toThrow("Invalid character '.' at position 3.");
	});
	test("Invalid syntax: Completely invalid syntax", () => {
		const action = () => parse("hello");
		expect(action).toThrow("Invalid character 'h' at position 0.");
	});
});

describe("6. Illogical Expressions Handling", () => {
	test("Invalid syntax: Empty expression", () => {
		const action = () => parse("");
		expect(action).toThrow("No tokens found.");
	});
	test("Invalid syntax: Multiple consecutive operators", () => {
		const action = () => parse("10++10");
		expect(action).toThrow("Expected a number or dice roll after '+' at position 3.");
	});
	test("Invalid syntax: Multiple consecutive operands", () => {
		const action = () => parse("10 10");
		expect(action).toThrow("Expected an operator after number or dice roll at position 3.");
	});
	test("Invalid syntax: Starting with an operator", () => {
		const action = () => parse("+10");
		expect(action).toThrow("Expression must start with a number or dice roll.");
	});
	test("Invalid syntax: Ending with an operator", () => {
		const action = () => parse("10+");
		expect(action).toThrow("Expression cannot end with an operator.");
	});
});

describe("7. Complex Expressions", () => {
	test("Complex expression with multiple operations and parentheses.", () => {
		const tokens = parse("1d5+(3+5d2)+2×((2d4+1d6)-2)").tokens;
		expect(tokens.length).toBe(7);
	});
});

function repeat(times: number, func: () => void) {
	return () => { for (let i = 0; i < times; i++) func(); };
}