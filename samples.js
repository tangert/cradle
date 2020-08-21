const arithemetic = `
start
  = additive

additive
  = left:multiplicative "+" right:additive { return left + right; }
  / multiplicative

multiplicative
  = left:primary "*" right:multiplicative { return left * right; }
  / primary

primary
  = integer
  / "(" additive:additive ")" { return additive; }

integer "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }
`

const sampleGrammar = "start = ('a' / 'b')+"
const arithmeticParser = peg.generate(arithemetic);
parser.parse("5+2"); // returns ["a", "b", "b", "a"]