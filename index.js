const VerEx = require('verbal-expressions');
const log = (s) => console.log(s)

// Basic syntax
// Basic idea is that this a really easy syntax for creating DAGs
const input = `
{
  an empty node {}
  another empty empty node
  start {
    name of node {
    then go to [[another node in parallel]]
      otherwise {
        go to [[start]]
      }
      a sub node {
        another link to [[name of node]]
      }
    }
    another node in paralell {
      nothin in here
    }
  }
}
`

/*
so, you only have three types of tokens

CONTENT = any string of alphanumeric characters except for {} and [[]].
NODE = {} represented by. either a content node with a new line, or a content node with brackets after it
LINK = [[]] a link uses wikilink syntax to indicate a connection to another node.

so this is one node
and this is another with a reference to [[so this is one node]]
*/


// the tokenzier takes your character stream and turns it into an array of individual units 
function tokenize(input){
  // once you split up into tokens, the lexer attaches metadata to each token
  function consumeContent(){}
  function consumeNode(){}
  function consumeLink(){}

  // lexeme is the actual content
  // type is the indentifier used in the. AST
  function createToken(type, lexeme){
    return {type, lexeme}
  }

  // algorithm
  // while you still have characters to read
  // check all regex matches for 
  return []
}

// the parser takes your tokens and creates an AST
function parse(tokens){}

// transpile to various output styles
function transpiler(tree){
  this.toDOT = function(){}
  // to UML
  this.toUML = function(){}
}