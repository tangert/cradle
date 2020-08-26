const peg = require("pegjs")
const fs = require("fs")


// Utils
const walk = (tree, callback) => {
  tree.forEach(child => {
    callback && callback(child);
    if(child.children) {
      walk(child.children, callback)
    }
  })
}
const log = (s) => console.log(s)
const last = (arr) => arr[arr.length-1]

// https://repl.it/@tangert/more-flow-dsl-sketching#index.js
const grammar = fs.readFileSync("grammar.pegjs", "utf8")
const parser = peg.generate(grammar)

// syntax highlighting?

const sampleInputs = [
  `step 1 -> step 2 (on click ->) step 3`,

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


/*
this creates an adjancency list from the ast
{
  1: [2]
  2: [3, 4, 5]
}
*/
// assumes global. unique name space

// Will take the ast and simple turn it into an object with string keys and values 
function createObject(ast) {
}

// sampleInputs.forEach(inp => {
//   const parsed = parser.parse(inp)
//   log("\n")
//   log("INPUT:")
//   log(inp)
//   log("AST:")
//   log(parsed)
//   walk(parsed.ast, function(child) {
//     log(child)
//     // if(child.type === 'group') {
//     //   child.start && log(child.start.content)
//     // } else if (child.content) {
//     //   log(child.content)
//     // }
//   })
//   log("\n")
// })

const userFlows = fs.readFileSync("examples/userFlows.cradle", "utf8")
const userFlowAST = parser.parse(userFlows)
// log(userFlows)
// log(userFlowAST)


// String interpolation example
// const nodes = ['a', 'b', 'c', 'd', 'e', 'b', 'e', 'f', 'e']
// const sequence = `${nodes.slice(1).reduce((acc,curr, idx) => acc + '->' + curr, nodes[0])}`
const sequence = `a <-> b <-> c <-> d -> e -> f <- g`
const parsedSequence = parser.parse(sequence)

// TODO: handle groups.
const buildGraph = (ast) => {
  let graph = {}
  let lastNode;
  let lastEdge;

  // Walk over the nodes and build the graph.
  walk(ast, (child) => {
    // If you find a node, check what the last node was and the last edge to decide how to add it to the last
    if(child.type === 'node') {
      // Initialize the adjacency list if it's not there.
      if(!graph[child.content]) {
        graph[child.content] = []
      }

      if(lastEdge && lastNode) {
        // found a connection!
        // add it onto the last node's list :)
        const curr = child.content
        const last = lastNode.content

        // Based on the different edge directions, add the nodes you find to the appropriate list.
        switch(lastEdge.direction) {
          case "forward":
            // add the current one to the last node's list
            if(!graph[last].includes(curr)) {
              graph[last].push(curr);
            }
            break;
          case "backward":
            // add the last node to the current one's list
            if(!graph[curr].includes(last)) {
              graph[curr].push(last)
            }
            break;
          case "bi":
            // Add them to each other's list
            if(!graph[curr].includes(last)) {
              graph[curr].push(last)
            }
            if(!graph[last].includes(curr)) {
              graph[last].push(curr);
            }
          default:
            return
        }
      }

      lastNode = child
    }
    // If you find an edge, store it to define how the next node you find gets added to the list
    if(child.type === 'edge') {
      lastEdge = child
    }
  })

  return graph
}

const cradleToDOT = (input) => {
  // parse the sequence
  const parsed = parser.parse(input)
  // get the graph
  const graph = buildGraph(parsed.ast)
  // create the DOT string
}

const g = buildGraph(parsedSequence.ast)

log("original sequence: ")
log(sequence)
log("\nAST: ")
log(parsedSequence.ast)
log("\ngraph: ")
log(g)
