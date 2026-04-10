import type { NumberToken } from "../models/Tokens/NumberToken";
import { tryParse } from "../Tokens/Tokens";
import { GroupToken } from "../Tokens/GroupToken";
import { OperatorToken } from "../Tokens/Operator";

export function tokenize(sentence: string): GroupToken {
	if (sentence == "") throw new Error("No tokens found.");

	const tokens = new GroupToken(sentence, 0);
	let currentGroup = tokens;
	let groupsStack: GroupToken[] = [];

	let i = 0;
	while (i < sentence.length) {
		let currSentence = sentence.slice(i);

		if (groupStart(currSentence)) {
			groupsStack.push(currentGroup);
			currentGroup = new GroupToken(sentence, i);
			i++;
		} else if (groupEnd(currSentence)) {
			const popped = groupsStack.pop();
			if (popped == null) throw new Error(`Unexpected closing parenthesis at position ${i}.`);	//TODO Aqui interesaran cosas como posicion, etc
			popped.push(currentGroup);
			currentGroup = popped;
			i++;
		} else if (whitespace(currSentence)) {
			const spaces = whitespace(currSentence) as number;
			i += spaces;
		} else {
			const token = tryParse(currSentence, i);
			if (token == false) throw new Error(`Invalid character '${sentence[i]}' at position ${i}.`);
			if (token.token != null) currentGroup.push(token.token);
			i += token.tokenLength;
		}
	}
	const unclosed = groupsStack.pop();
	if (unclosed != null) throw new Error(`Unclosed parenthesis at position ${unclosed.position}.`);
	return tokens;
}

export function checkFinalResults(tokens: GroupToken) {
	let [lastToken, ...rest] = tokens.tokens;
	if (lastToken instanceof OperatorToken) throw new Error("Expression must start with a number or dice roll. Got " + lastToken.representation);


	for (const token of rest) {
		if (token instanceof OperatorToken) {
			if (lastToken instanceof OperatorToken) throw new Error(`Expected a number or dice roll after '${token.value}' at position ${token.position}.`);
		} else {
			if (!(lastToken instanceof OperatorToken)) throw new Error(`Expected an operator after number or dice roll at position ${(token as NumberToken).position}.`);
		}

		if (token instanceof GroupToken) checkFinalResults(token);

		lastToken = token;
	}

	if (lastToken instanceof OperatorToken) throw new Error("Expression cannot end with an operator.");

}

export function parse(sentence: string) {
	const tokens = tokenize(sentence);
	checkFinalResults(tokens);
	return tokens;
}

function groupStart(sentence: string) {
	if (/^\(/.test(sentence)) return true;
	return false;
}
function groupEnd(sentence: string) {
	if (/^\)/.test(sentence)) return true;
	return false;
}
function whitespace(sentence: string) {
	const matches = /^(\s+)(.*)/.exec(sentence);

	if (matches == null) return false;
	return matches[1]!.length;
}
