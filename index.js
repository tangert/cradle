const VerEx = require('verbal-expressions');
// https://verbalexpressions.github.io/JSVerbalExpressions/
const log = (s) => console.log(s)

/*
Basic syntax
Basic idea is that this a really easy syntax for creating DAGs

CURRENT IMPLEMENTATION: 
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
  NODE_OPEN: '{',
  NODE_CLOSE: '}',
}

const MULTILINE_DELIMETERS = {
  MULTILINE_OPEN: '(',
  MULTILINE_CLOSE: ')',
}

const LINK_DELIMETERS = {
  LINK_OPEN: '[[',
  LINK_CLOSE: ']]',
}

const NEW_LINE = '\n'

const ALL_DELIMETERS = {
  ...NODE_DELIMETERS,
  ...MULTILINE_DELIMETERS,
  ...LINK_DELIMETERS,
  NEW_LINE
}

function Tokenizer() {

  // Delimeters
  const { NODE_OPEN, NODE_CLOSE } = NODE_DELIMETERS
  const { LINK_OPEN, LINK_CLOSE } = LINK_DELIMETERS
  const { MULTILINE_OPEN, MULTILINE_CLOSE } = MULTILINE_DELIMETERS

  // Regex rules
  const contentRule = VerEx().anythingBut([Object.values(ALL_DELIMETERS)]).source
  const nodeOpenRule = VerEx().find(NODE_OPEN).source
  const nodeCloseRule = VerEx().find(NODE_CLOSE).source
  const linkOpenRule = VerEx().find(LINK_OPEN).source
  const linkCloseRule = VerEx().find(LINK_CLOSE).source
  const multilineOpenRule = VerEx().find(MULTILINE_OPEN).source
  const multilineCloseRule = VerEx().find(MULTILINE_CLOSE).source
  const newLineRule = VerEx().find(NEW_LINE).source

  this.tokenize = function(input) {
    let stream = input
    let tokens = []
    while(stream.length) {
      const checked = this.checkContent(stream)
      || this.checkNodeOpen(stream)
      || this.checkNodeClose(stream)
      || this.checkLinkOpen(stream)
      || this.checkLinkClose(stream)
      || this.checkMultilineOpen(stream)
      || this.checkMultilineClose(stream)
      || this.checkNewLine(stream)


      if(!checked) {
        console.error('u fucked SYNTAX ERROR up')
        return
      }
      
      // Only push the trimmed version of the lexeme, but keep it in the original to continue parsing correctly
      // const formattedToken = {
      //   type: checked.type,
      //   lexeme: checked.lexeme.trim()
      // };

      // if(formattedToken.lexeme.length > 0) {
      //   // Only add non-0 length tokens
      // }
      console.log(checked.lexeme)
      tokens.push(checked)
      stream = stream.slice(checked.lexeme.length);
    }
    return tokens;
  }

  // REGEX MATCHERS
  // once you split up into tokens, the lexer attaches metadata to each token
  // lexeme is the actual content
  // type is the indentifier used in the AST

  // CONTENT
  this.checkContent = function(inp) {
    const m = inp.match(contentRule);
    if (m && m[0]) {
      return this.createToken('CONTENT', m[0])
    }
    return null
  }
  // NODES
  this.checkNodeOpen = function(inp){
    const m = inp.match(nodeOpenRule);
    if (m && m[0]) {
      return this.createToken('NODE_OPEN', m[0])
    }
    return null
  }
  this.checkNodeClose = function (inp){
    const m = inp.match(nodeCloseRule);
    if (m && m[0]) {
      return this.createToken('NODE_CLOSE', m[0])
    }
    return null
  }
  // LINKS
  this.checkLinkOpen = function(inp){
    const m = inp.match(linkOpenRule);
    if (m && m[0]) {
      return this.createToken('LINK_OPEN', m[0])
    }
    return null
  }
  this.checkLinkClose = function(inp){
    const m = inp.match(linkCloseRule);
    if (m && m[0]) {
      return this.createToken('LINK_CLOSE', m[0])
    }
    return null
  }

  // MULTILINES
  this.checkMultilineOpen = function(inp){
    const m = inp.match(multilineOpenRule);
    if (m && m[0]) {
      return this.createToken('MULTILINE_OPEN', m[0])
    }
    return null
  }
  this.checkMultilineClose = function(inp){
    const m = inp.match(multilineCloseRule);
    if (m && m[0]) {
      return this.createToken('MULTILINE_CLOSE', m[0])
    }
    return null
  }
  // New line
  this.checkNewLine = function(inp){
    const m = inp.match(newLineRule);
    if (m && m[0]) {
      return this.createToken('NEW_LINE', m[0])
    }
    return null
  }

  // UTILITY FOR CREATING TOKEN OBJECTS
  this.createToken = function(type, lexeme){
    return { type, lexeme }
  }
}

// the parser takes your tokens and creates an AST
function Parser(tokens){}

// transpile to various output styles
function Transpiler(tree){
  // DOT graph description language
  this.toDOT = function(){}
  // UML diagram
  this.toUML = function(){}
  // transforms this into an executable CLUI tree with autocomplete.
  this.toCLUI = function(){}
}

//  testing
const input = `
 {
    start {
      the first step is this {
        then here's the second node {
          but if you fail you go back to [[start]]
        }
        here's an example where the nodes are linked back {
          by linking to [[start]]
        }
      }
      (this node is in paralell to first step.
      you can view it as another option. it's multiline so you wrap it in parentheses)
  }
`

const ex2 = `
  starting node {
    child node {
      another child node {
        here's a link back to [[starting node]]
      }
    }
  }
`

// TODO: remove whitespace from content and tokens...
// TODO: fix order of tokens being eaten up lol
const t = new Tokenizer()
const tokens = t.tokenize(input)
log("\nTOKENS:")
log(tokens)
log("INPUT:")
log(input)

/*

// arrows are links between nodes
// nodes are simply text
// parallel branches are contained in curly braces
// you can use wikilink syntax to link notes together
// transpiles to DOT or UML 
starting node -> child node -> another child -> link back to [[starting node]]

start {
  branch 1  -> step 1 -> step 2 -> step 3 {
    branch 1.3 -> go back to [[start]]
  } 
  branch 2 -> step 1 -> step 2 -> step 3
} 

im dependent on this! <-> and im dependent on that! 

if i do this {
  go [[here]]
  otherwise go [[there]]
}
here -> do this next 
there -> do this next


// ideal UX here:


write it in a "repl" type environment with auto complete



thoughts... if you want to structure your data, you can place it into parentheses
(title: here, label: this is where u need to go.)
// more ideas:
then you can refference the wikilinks like [[ title='here' and label contains 'u' ]]
// kinda like roam

*/