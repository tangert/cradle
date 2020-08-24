const peg = require("pegjs")
const log = (s) => console.log(s)

// https://pegjs.org/documentation
/*
Let's get organized!
What's here?

You have nodes, and you have edges. It's a graph. But you write it like prose, and it's highly structured.

The goal of dagger is to build DAGs (directed acyclic graphs) in an intuitive way that resembels how designers typically build and think about user flows. It lets you write with whitespace, nest things in hierarchies, and reference specific parts of flows really easily.

This library comes with a parser (which exports the AST), a transpiler (which converts the AST into either DOT or UML), and a renderer (which takes the AST and has an opinonated set of SVG objects and / or React components that will let you create interactive graphs).

While this is optimized for brainstorming quickly, it can also just be used as a base for mindmapping tools in general and runs wherever JavaScript runs.


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

// This grammar 
// TODO: figure out how to get nested things working
const daggerGrammer = `
start = Graph

// Finally build the graph
// This is where the magic happens!
Graph "graph" = allUnits: (NodeEdgeUnitList / Branch)* {
    return {
    	ast: allUnits
    }
 } 

Branch "branch" = content: ((Node)?(_ BranchOpener _(Branch / NodeEdgeUnitList)+_ BranchCloser)) {
	return {
    	type: "branch",
        // the first flat removes any whitespace or unneeded stuff from the filter
        content: content.flat()
                        .filter(c => c && c.type !== 'whitespace' && c.type !== 'branch')
                        // the second flat turns all of the sequences into one lisit
                        .flat()
    }
}

// Either seprate them by commas or just have a regular unit
NodeEdgeUnitList = content:((NodeEdgeUnit+",")* (NodeEdgeUnit+_)) {
	return {
    	type: "nodeEdgeUnitList",
        content: content.flat().filter(c => c.type !== 'whitespace')
    }
}

BranchOpener = char: "{" {
	return {
    	type: "branch",
        kind: "opener",
        content: char
    }
}

BranchCloser = char: "}" {
	return {
    	type: "branch",
        kind: "closer",
        content: char
    }
}

NodeEdgeUnit "unit" = unit:(_ Node _ Edge*) {
	return {
    	type: 'nodeEdgeUnit',
    	content: unit.flat().filter(n => n.type !== 'whitespace')
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

UnlabeledEdge "unlabeled edge" = edge:(BiEdge/ForwardEdge/BackwardEdge) {
  return edge 
}

BiEdge "bidirectional edge" = content:"<->" {
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
InterwordWs "interword whitiespace" = ws:_ {
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
}
`

const daggerParser = peg.generate(daggerGrammer);
const sampleInput = `
  step 1 -> step 2 (on ->) step 3
`

log("input: " + sampleInput)
const { ast } = daggerParser.parse(sampleInput)
