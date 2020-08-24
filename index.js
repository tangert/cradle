const peg = require("pegjs")
const log = (s) => console.log(s)


/*
- NODES are any piece of text
  - Nodes can be referenced by their full name
  - Their children can be accessed through dot notation.
  - In the future, you'll be able to give aliases to nodes, and access them through array indices

- EDGES are arrows between pieces of text.
  - Edges can also contain LABELS.

All text around arrows are nodes.
If you want to label an edge, you wrap it in parentheses.
*/

// https://pegjs.org/online
// https://pegjs.org/documentation
// This grammar 
// TODO: figure out how to get nested LISTS of branches working 
const daggerGrammer = `
start = Graph

// BUG: the last node in teh sequence is getting iti's first letter cut off
// Finally build the graph
// This is where the magic happens!

Graph "graph" = children: (Sequence / Group)* {
    return {
    	ast: children
    }
 } 

// ONCE AGAIN THE PROBLEM IS NESTED BRANCHES
Group "group" = children: (Node?(_ GroupOpener (Group / Sequence ","*)+ GroupCloser _)+) {
	  return {
    	  type: "group",
        // the first flat removes any whitespace or unneeded stuff from the filter
        children: children.flat()
                        .filter(c => c && c.type !== 'whitespace' && c.type !== 'branch')
                        // the second flat turns all of the sequences into one list
                        .flat()
    }
}

// Either seprate them by commas or just have a regular unit
Sequence "sequence"  = children:((NodeEdgeUnit+",")* (NodeEdgeUnit+_)_) {
	return {
    	type: "sequence",
        // should this be responsibile for combing the liist into  one thing?
        // probably
        children: children.flat().filter(c => c.type !== 'whitespace')
    }
}

GroupOpener = char: "{" {
	return {
    	type: "group",
      kind: "opener",
      content: char
    }
}

GroupCloser = char: "}" {
	return {
    	type: "group",
      kind: "closer",
      content: char
    }
}

NodeEdgeUnit "unit" = unit:(_ Node _ Edge*) {
	return {
    	type: 'nodeEdgeUnit',
    	children: unit.filter(n => n.type !== 'whitespace')
    }
}

Edge "edge" = edge:(LabeledEdge / UnlabeledEdge) {
  return edge
}

// Edges
// Labeled edges wrap arrows in parens and let you write text
LabeledEdge "labeled edge" = content:"("label:Node edge:UnlabeledEdge")" {
  return {
        type: "edge",
        kind: edge.kind,
        content: edge.content,
        label: label.content
    }
}

UnlabeledEdge "unlabeled edge" = edge:(BidirectionalEdge/ForwardEdge/BackwardEdge) {
  return edge 
}

BidirectionalEdge "bidirectional edge" = content:"<->" {
  return { type: "edge", kind: "bi", content } 
}

ForwardEdge "forward edge" = content:"->" {
  return { type: "edge", kind: "forward", content } 
}

BackwardEdge "backward edge" = content:"<-" {
  return { type: "backward", kind: "backward", content } 
}

Node "node" = content:(Word InterwordWs)+ {
  return {
      type: "node",
      content: content.map(c => c[0] + c[1]).join('').trim()
    }
}

// One level up
InterwordWs "interword whitespace" = ws:_ {
  return ws.content.join("")
}

// Basics
Word "word" = letters:letter+ {
  return letters.join("")
}

letter "letter" = [A-Za-z0-9]

// We return an object so we can easily filter
_ "whitespace" = content: [ \\t\\n\\r]* {
	return {
    	type: "whitespace",
      content
    }
}`

const daggerParser = peg.generate(daggerGrammer);

const sampleInput = `step 1 -> step 2 (on ->) step 3`

// want to cover this syntax:
// google -> oauth
// github -> oauth
// facebook -> oauth
// { google, github, facebook } -> oauth
// basically a "reverse tree"
// { google, github, facebook } -> { tech companies, employers, public}
// need to cover naked transitions

const signupFlows = `
root {  
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
}`


// support for wikilink syntax

const submissionFlow = `
root {
  in workspace (press submit ->) submission modal
  outside workspace {
    in my repls {

    }
    on home {

    }
  }
}
`

const test2 = `
root {
  1 {
    a -> b -> c
  },
  2 {
    a -> b -> c
  }
}`

// how do you name flows ?

const test3 = `
graph {
  a -> b,
  c <-> d,
  e (on click <->) f,
  g {
    if true {
    },
    otherwise {
    }
  }
}
`

log("input: " + sampleInput)
const ast = daggerParser.parse(test2)
log(test2)
log(ast)
// cool, now you have the AST!
// now you can create a walking functioin like anything else