# dieparser

## Requirements
Write a fully-fledged dice parser.

A dice throw uses the syntax nds where n is the number of throws and s the number of sides.  
For instance, 1d20 gives a result between 1 and 20, 2d6 between 2 and 12, etc. ds is interpreted as 1ds.  
A negative or null number of sizes must cause an error.

Arithmetic operations and parenthesis must be supported.  
Divisions must be available with both / and ÷.  
Multiplications must be available with x, × and *.

## Usage
Releases can be found in the [releases section](https://github.com/ajuanjojjj/DieParser/releases) of this repository.  
You also can download the source code and run it with bun (`bun src/Cli.ts` or `bun src/Cli.ts <input>`), or install with any node package manager and run with npm/yarn/pnpm start.  
Tests can be run with `npm/yarn/pnpm/bun run test`. These include a file for the [tokenizer](./src/util/Tokenizer.ts) and another for the [executer](./src/util/Executer.ts).  

## Tips
Make sure to respect order of operations.  
It must accept an arbitrary number of spaces between tokens, including none.  
Examples of valid inputs:  
`1d20 * 2`  
`d6 + 2d8 + 2 × (2d13 - d4)`  
`d6+2d8+2×(2d13-d4)`  

It must show all the intermediate results on top of the total.  
For example, that last input could generate an output like `5+(3+5)+2×((8+3)-2) = 31`

If the input is invalid, your program must show a user-friendly error explaining what went wrong and where.
