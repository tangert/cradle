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

// This grammar 
const daggerGrammer = `
  start = Graph

  // Finally build the graph
  // This is where the magic happens!
  Graph "graph" = allPairs:(_ Node _ Edge*)*  {    
      return allPairs
                  // Flatten out all the edges
              .map(pair => pair.flat())
              // Then flatten out all the combos
              .flat()
                      // Then remove the white space
                      .filter(n => n !== " ")
  } 

  // TODO: Branch
  Edge = edge:(LabeledEdge / UnlabeledEdge) {
    return edge
  }

  // Edges
  // Labeled edges wrap arrows in parens and let you write text
  LabeledEdge = content:"("label:Node edge:UnlabeledEdge")" {
    return {
        type: "edge",
          kind: edge.kind,
          label: label.content
      }
  }

  UnlabeledEdge "edge" = edge:(BiEdge/ForwardEdge/BackwardEdge) {
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
  InterwordWs = ws:_ {
    return ws.join("")
  }

  // Basics
  Word "word" = letters:letter+ {
    return letters.join("")
  }

  letter "letter" = [A-Za-z0-9]

  _ "whitespace" = [ \\t\\n\\r]*
`

const daggerParser = peg.generate(daggerGrammer);