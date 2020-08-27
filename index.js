const peg = require("pegjs")
const fs = require("fs")


// Utils
const walk = (tree, callback) => {
  tree.forEach(child => {
    callback && callback(child);
    if (child.children) {
      walk(child.children, callback)
    }
  })
}
const log = (s) => console.log(s)
const last = (arr) => arr[arr.length - 1]

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
log(userFlows)
log(userFlowAST)


// String interpolation example
// const nodes = ['a', 'b', 'c', 'd', 'e', 'b', 'e', 'f', 'e']
// const sequence = `${nodes.slice(1).reduce((acc,curr, idx) => acc + '->' + curr, nodes[0])}`

// TODO: handle sub / nested groups.
const buildGraph = (ast) => {
  let graph = {}
  // To determine how to add edges into the list
  let lastNode;
  let lastEdge;
  // To keep track if you're inside a group
  let lastGroup;
  let lastSequenceLength = 0;
  let startOfSequence = false;

  // formats the node
  const Node = (content, label) => ({
    node: content,
    // Add a label if there's one
    ...(label && { label })
    })

  // Walk over the nodes and build the graph.
  walk(ast, (child) => {
    // If you find a node, check what the last node was and the last edge to decide how to add it to the last
    if (child.type === 'node') {
      // Initialize the adjacency list if it's not there.
      if (!graph[child.content]) {
        graph[child.content] = []
      }

      if (lastGroup && startOfSequence) {
        // You found the start of a sequence inside of a group.
        // Push the current one
        // It's implied that a group is a forward edge
        graph[lastGroup.start.content].push(Node(child.content))
        startOfSequence = false;
      }

      if (lastEdge && lastNode) {
        // found a connection!
        // add it onto the last node's list :)
        let _to = Node(child.content, lastEdge.label)
        let _from = Node(lastNode.content, lastEdge.label)

        // Switch direction if it's backward
        if (lastEdge.direction === 'backward') {
          const tmp = _to
          _to = _from
          _from = tmp
        }

        // Add the edges 
        if (!graph[_from.node].includes(_to.node)) {
          graph[_from.node].push(_to)
        }

        // If it's bidirectional, add the reverse as well.
        if (lastEdge.direction === 'bi' && !graph[_to.node].includes(_from.node)) {
          graph[_to.node].push(_from);
        }
      }

      lastSequenceLength--;
      // got to the end of a sequence
      if (lastSequenceLength === 0) {
        // once you reach the end of a sequence set the last node and edge to null so you have a fresh start
        lastNode = null
        lastEdge = null
      } else {
        lastNode = child
      }

    }

    else if (child.type === 'group') {
      // Initialize
      if (!graph[child.start.content]) {
        graph[child.start.content] = []
      }
      if (lastGroup) {
        // add the edge if this is a subgroup
        graph[lastGroup.start.content].push(Node(child.start.content))
      }
      lastGroup = child
    }
    else if (child.type === 'sequence') {
      startOfSequence = true
      lastSequenceLength = child.children.filter(c => c.type === 'node').length
    }
    // If you find an edge, store it to define how the next node you find gets added to the list
    else if (child.type === 'edge') {
      // check for labels where to store them.
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
  log(graph)
}


const sequence = `
test group {
  a <-> b <-> c <-> d -> e -> f <-> g,
  cool <-> beans,
  awesome (on click ->) dude,
  back <- to back,
  subgroup {
    wow -> hi,
    another sub {
      niceee -> owwooow
    }
  }
}`


const parsedSequence = parser.parse(sequence)


log("original sequence: ")
log(sequence)
log("\nAST: ")
log(parsedSequence.ast)
log("\n dot conversion : ")
const dot = cradleToDOT(sequence)