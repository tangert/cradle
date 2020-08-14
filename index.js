const VerEx = require('verbal-expressions');
// https://verbalexpressions.github.io/JSVerbalExpressions/
const log = (s) => console.log(s)

/*
Basic syntax
Basic idea is that this a really easy syntax for creating DAGs

idea 1:
  {
    start {
      the first step is this {
        then here's the second node {
          but if you fail you go back to [[start]]
        }
        here's an example where the nodes are linked back {
          by linking to [[]]
        }
      }
      (this node is in paralell to first step.
      you can view it as another option. it's multiline so you wrap it in parentheses)
  }

idea 2:
  start > 
    the first step is this >
      then here's the second node >
        but if you fail go back to [[start]]
        otherwise continue to [[here]]
        here >
          this is the next step in process
          this step is bidirectional <>
            as you can see by the double brackets "<>"
  }


so, you only have three types of tokens

NODE = {} represented by. either a content node with a new line, or a content node with brackets after it
CONTENT = any string of alphanumeric characters including whitespace (but excluding new lines). Used as the label for each node
LINK = [[]] a link uses wikilink syntax to indicate a connection to another node.

so this is one node
and this is another with a reference to [[so this is one node]]
*/

const NODE_DELIMETERS = {
  OPEN_BRACKET: '{',
  CLOSE_BRACK: '}',
}

const MULTILINE_DELIMETERS = {
  OPEN_PAREN: '(',
  CLOSE_PAREN: ')',
}

const LINK_DELIMETERS = {
  OPEN_LINK: '[[',
  CLOSE_LINK: ']]',
}

const NEW_LINE = '\n'

const DELIMETERS = {
  ...NODE_DELIMETERS,
  ...MULTILINE_DELIMETERS,
  ...LINK_DELIMETERS,
  NEW_LINE
}

const contentRule = VerEx().anythingBut([Object.values(DELIMETERS)])

function tokenize(input){
  function consumeContent(){
  }
  function consumeNode(){}
  function consumeLink(){}

  // once you split up into tokens, the lexer attaches metadata to each token
  // lexeme is the actual content
  // type is the indentifier used in the. AST
  function createToken(type, lexeme){
    return { type, lexeme }
  }

  // algorithm
  // while you still have characters to read
  // check all regex matches for most relevant node type

  return []
}

// the parser takes your tokens and creates an AST
function parse(tokens){}

// transpile to various output styles
function transpiler(tree){
  this.toDOT = function(){}
  this.toUML = function(){}
}