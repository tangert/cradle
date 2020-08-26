const peg = require("pegjs")
const fs = require("fs")
const log = (s) => console.log(s)
const last = (arr) => arr[arr.length-1]

const grammar = fs.readFileSync("grammar.pegjs", "utf8")
const parser = peg.generate(grammar)

// syntax highlighting?

const sampleInputs = [
  `step 1 -> step 2 (on ->) step 3`,

  `root { 1 -> 2, 3 -> 4, subgraph { 1 -> 2 }}`,

  `sign up flows {  
    sign up {
      if youre already signed up -> login,
      else {
        sign up with {
          google -> oauth,
          github -> oauth,
          facebook -> oauth,
          email
        }
      }
    },
    login {
      choose provider {
        google,
        github,
        facebook,
        email -> enter in email and password
      }
    }
  }`,
  
  `root {
    1 {
      a -> b -> c
    },
    2 {
      a -> b -> c
    }
  }`,

  `r{1{},2{3{}}}`,
  
  `{}`,
]


function walk(tree) {
  tree.forEach(child => {
    if(child.type === 'group') {
      child.start && log(child.start.content)
    } else if (child.content) {
      log(child.content)
    }
    if(child.children) {
      walk(child.children)
    }
  })
}




/*
this creates an adjancency list from the ast
{
  1: [2]
  2: [3, 4, 5]
}
*/
// assumes global. unique name space
function createGraph(ast) {
  // how to parse sequences
  // 1 -> 2 -> 3 -> 4

  // keep track of the last reference node
  // you get to a node
  // if it's 

  // how to parse groups

}

sampleInputs.forEach(inp => {
  const parsed = parser.parse(inp)
  log("\n")
  log("INPUT:")
  log(inp)
  log("AST:")
  log(parsed)
  walk(parsed.ast)
  log("\n")
})

const userFlows = fs.readFileSync("examples/userFlows.cradle", "utf8")
const userFlowAST = parser.parse(userFlows)
log(userFlows)
log(userFlowAST)

// String interpolation example
const nodes = ['a', 'b', 'c', 'd', 'e']
const sequence = `${nodes.slice(1).reduce((acc,curr, idx) => acc + '->' + curr, nodes[0])}`
const parsedSequence = parser.parse(sequence)
log(sequence)
log(parsedSequence)
