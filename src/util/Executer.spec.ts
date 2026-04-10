import { describe, expect, test } from 'vitest';
import { execute } from "./Executer.js";

describe("1. Simple Arithmetic", () => {
	test("Simple addition.", () => {
		const tokens = [6, "+", 2];
		const result = execute(tokens);
		expect(result).toBe(8);
	});
	test("Simple subtraction.", () => {
		const tokens = [10, "-", 4];
		const result = execute(tokens);
		expect(result).toBe(6);
	});
	test("Simple Multiplication.", () => {
		const tokens = [2, "*", 3];
		const result = execute(tokens);
		expect(result).toBe(6);
	});
	test("Simple Division.", () => {
		const tokens = [10, "/", 2];
		const result = execute(tokens);
		expect(result).toBe(5);
	});
});

describe("2. Chained operations", () => {
	test("Mixed additions and sustractions", () => {
		const tokens = [2, "+", 3, "-", 4];
		const result = execute(tokens);
		expect(result).toBe(1);
	});
	test("Order doesn't matter for multiplication .", () => {
		const tokens = [10, "*", 2, "*", 5];
		const result = execute(tokens);
		expect(result).toBe(100);
	});
	test("Mixed multiplication and division.", () => {
		const tokens = [10, "*", 2, "/", 5];
		const result = execute(tokens);
		expect(result).toBe(4);
	});
});

describe("3. Order of Operations", () => {
	test("Multiplication before addition.", () => {
		const tokens = [2, "+", 3, "*", 4];
		const result = execute(tokens);
		expect(result).toBe(14);
	});
	test("Division before addition.", () => {
		const tokens = [10, "/", 2, "+", 1];
		const result = execute(tokens);
		expect(result).toBe(6);
	});
});
