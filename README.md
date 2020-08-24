# What is Dagger?

Dagger is a language for designing interactions, experiences, and flows. Interaction and UX design involve complex logic and structure, but our tools for "designing experiences" are often limited to drawing boxes manually in Figma/Sketch/Omnigraffle/whatever flavor of mind mapping or wireframing tool you use, using complex JavaScript libraries, learning DOT (which is not intended for designs), or just using natural language. Dagger's intent is to try formalize experience and interaction design as code.

More specifically, Dagger is a DSL (domain specific language) for building DAGs (directed acyclic graphs) in an intuitive way that resembles natural language. It lets you write with whitespace, nest things in hierarchies easily, and create different kinds of links between nodes easily. It's not "feature complete" or intended to be a complete replacement for DOT (especially its renderer), but that's not the point. It's supposed to be easy to use and get the job done. It is also not a new concept to think of UIs and UX with state machines and graphs. But the emphasis in Dagger here is on syntax and ease of use. It should feel like writing, but just a little bit more structured.

(link to prior art)

Dagger is opinionated and takes the stance that design specs should be: 
- Versionable
- Portable - not stuck in any specific design program
- Visualizable
- Lintable
- Testable - error handling is huge in UX! 

# In progress

High priority:
- A parser (which exports the AST)
- A transpiler (which converts the AST into either DOT or UML)
- A renderer (which takes the AST and has an opinonated set of SVG objects and / or React components that will let you create interactive graphs).

After:
- An interactive CLUI app for specifying dagger graphs and interacting with them through text and clicking
- A Figma Dagger plugin that let's you automatically render 

While this is optimized for brainstorming quickly, it can also just be used as a base for mindmapping tools in general and runs wherever JavaScript runs. Because these graphs are just strings and can be used inside of any javascript app, you can just use string interpolation to atuomate building parts of your graph. Like this!

```javascript
const companies = ['apple', 'google', 'microsoft', 'replit']
const flow = `
    sign in with { ${companies.join(",")} -> go to oauth }
`
```
