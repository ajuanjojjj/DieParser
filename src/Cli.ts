import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import { execute, simplify, stringifyTokens } from "./util/Executer";
import { parse } from "./util/Tokenizer";

async function cli() {
	const rl = readline.createInterface({
		input: stdin,
		output: stdout
	});

	console.log("Enter the dice sequence to parse");
	const request = await rl.question("> ");
	main(request);
	rl.close();
}

function main(request: string) {
	try {
		console.log(`Parsing: '${request}'`);

		const tokens = parse(request);
		console.log(tokens.stringify());

		let result1 = simplify(tokens);
		console.log(stringifyTokens(result1));

		let result = execute(result1);
		while (Array.isArray(result)) {
			console.log(stringifyTokens(result));
			result = execute(result);
		}

		console.log("Result: " + result);
	} catch (e) {
		console.error("Error: " + (e as Error).message);
	}
}

const args = process.argv.slice(2);
if (args[0]) main(args[0]);
else cli();