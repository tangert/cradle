# What is Cradle?

Cradle is a DSL (domain specific language) for making flowcharts and graphs really easily. Interaction and UX design involve complex logic and structure, but our tools for designing experiences are often limited to drawing boxes+arrows manually in Figma/Sketch/Omnigraffle/whatever flavor of mind mapping or wireframing tool you use, using complex JavaScript libraries, learning DOT or UML (which are not intended for design), or just using natural language. Cradle's intent is to try formalize experience and interaction design as code.

Cradle has an intuitive syntax that lets you write with whitespace, nest things in hierarchies easily, and create different kinds of links between nodes easily. It should feel like writing, but just a little bit more structured.

It's not "feature complete" or intended to be a complete replacement for DOT (especially its renderer), but that's not the point. It's supposed to be easy to use and get the job done. It is also not a new concept to think of UIs and UX with state machines and graphs. But the emphasis in Cradle here is on syntax and ease of use.

Cradle is opinionated and takes the stance that design specs should be: 
- Versionable
- Portable - not stuck in any specific design program
- Visualizable
- Lintable
- Testable - error handling is huge in UX! 

Prior art and references:
- https://sketch.systems/
- https://pegjs.org/online
- https://lezer.codemirror.net/
- https://www.antlr.org/
- https://js.cytoscape.org/
- https://github.com/mattrasto/phase
- https://flowchart.js.org/
- https://github.com/davidkpiano/xstate
- https://rsms.me/graphviz/

# How does it work?

Your Cradle spec is just text. It can either live as a text file you read, or as a string in code. Here are the basics of the syntax

### Syntax
#### Nodes
Nodes are just text. They're basically any alphanumeric character, and they represent the boxes you'd draw in a graph. You connect Nodes together with various kinds of arrows to form sequences.
```
this is a node
```
```
this is a node too and it includes spaces
```

#### Edges
Edges are arrows between nodes that link them together.

This is biased right now towards people who read/write LTR languages (because I speak English), but I'm thinking of making a config section for any spec where you can set the parsing to RTL, which would switch the symbols for Forward and backward edges.

There are three kinds: 
- Forward `->`
- Backward `<-`
- Bidirectional `<->`

If you want to add a label to an edge, wrap it in parentheses and write text before it.

- `(on click ->)`
- `(backwards baby <-)`
- `(this goes both ways <->)`

#### Sequences
Sequences are the basic part of Cradle. Often when designing flows, we like to write things with arrows and events between them. For example:
```
step 1 -> step 2 -> step 3
```
If you want to label transitions, simply wrap the arrow in parentheses and write some text before it.
```
step 1 (transition label ->) step 2 -> step 3
```
If you want to indicate directionality, just adjust the direction of the edge as indicated above.
```
// bidirectional
step 1 <-> step 2 <-> step 3
```
```
// forward
step 1 -> step 2 -> step 3
```
```
// backward
step 1 <- step 2 <- step 3

```
Let's get a practical example in here. If you're designing basic interactions for a web app, and you want to specify what happens when you click on a menu. You can define that like this:
```
menu (on click ->) open popover
```

Now, apps usually have tons of different flows/sequences grouped together. How do we group them in Cradle? Groups!

#### Groups
A group allows you to make lists of sequences and other groups.
Groups are anything contained inside 2 curly braces. You write commas between sequences and groups to separate them.
```
group {
  step 1 -> step 2,
  step 3 -> step 4,
  subgroup {

  },
  subgroup2 {

  }
}
```

Let's take the interactions example from before and expand on it. Usually, we like to define what happens to UI elements with various interactions. Using groups we can easily organize them like this:

(shorthand syntax still WIP)
```
menu interactions {
  menu (on click ->) open popover,
  menu (on hover ->) show tooltip,
  menu (on focus ->) ...
}
```


# Open questions:
- How to handle styling?
  - Should that be included in the graph itself (like DOT) or handled outside?
- Parameterization?
  - Should this be owned by Cradle or left up to the host language?
- Functions?
  - Should Cradle have its own simple version of functions that can take an input, parameterize it, and spit out an output?
- Types?
  - Should nodes and edges have types? More specifically, can we easily allow users to make their own types or templates of Nodes and Edges?
- Variables / references / aliases / node scope? 
  - Can nodes have multiple names / references? If so, what's the easiest syntax to do that? 
  - Should everything be in a global namespace?
  - What if you could refer to nodes by their parents using dot notation or array indexing?
  - `user flow.step 1`, `user flow.0`, `user flow.first` could all refer to the same node

# In progress
High priority:
[x] A parser (which exports the AST)
[x] A transpiler (which converts the AST into DOT)
[ ] A renderer (which takes the AST and has an opinonated set of SVG objects and / or React components that will let you create interactive graphs).

After:
- An interactive CLUI app for specifying Cradle graphs and interacting with them through text and clicking
- A Figma Cradle plugin that let's you automatically render 
