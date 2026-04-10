export abstract class BaseToken {
	constructor(
		public readonly representation: string,
		public readonly position: number
	) { }
}