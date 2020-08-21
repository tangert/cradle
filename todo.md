you want to optimize for speed here
brainstorming
Some sample DAGs:

you dont want to be confused
you want to be able to do this fast
cant have too many primitives otherwise youll get bogged down thinking about it

in sketch.systems, transitions are exclusively what comes before an arrow.
in dagger, transitions are explicitly labeled and nodes are what you deal with  

sign up flow {
  if you dont have an account {
    fill in your details {
      if there's an error {
        show them the right error message 
      }
      else -> 
    }
  } else {
    login {

    }
  }
}

// here, all text is a node unless its paren'd
you can do this if you want to do it inline 
search bar { start (on focus ->) active (on clear ->) start }

here transitions are exclusively reliant on being nested, and aren't self contained.




vs search bar {
  start {
    on focus -> active
  }
  active {
    on clear -> start
  }
}

search 

search bar {
  inactive {
    on focus -> active
  }
  active {
    when you type -> text entry
  }

  step 1 -> step 2 -> step 3
}


1. Let's say you want to prototype a Search Bar
search bar {
  inactive (on focus ->) active
  active {
    (when you type ->) text entry
    (on cancel ->) inactive
    (on clear ->) empty
    empty
    text entry
      (on submit ->) results
    results
  }  
}

IDEAS:

basics:

1d
Different directions
Branching / nesting
Labels along edges


If you want to label an edge, you wrap it in parentheses

Interactions {
	(transition ->) state 1 (onClick ->) clickHandler,
	state 1 (onHover ->) hoverHandler,
}



Interactions {
     (On click ->) branch 1,
     (On hover ->) branch 2
}

Short hand for:
Interactions (On click ->) branch 1
Interactions (On hover ->) branch 2



It will automatically link to nodes with the same name
It goes through and finds the dependency graph

Interactions {
   Draw { on, towards }
   On -> screen
   towards -> edge
   Paint 
   Scrub 
   Drag 
}

By default, all it does is output the data structure of nodes and edges (an adjacency list). You can also export an adjacency matrix.

It can transpile to DOT or UML. 

Using the exported data structure you can build your own render function, such as Rendering interactive React components that go back and adjust the tree then recompiles, or building an SVG renderer, integrating it with writing tools, etc


There are two parts to the Dagger library: the parser and the renderer.
The parser takes in input Dagger syntax and outputs it to whatever format you specify. By default its just the AST.

The renderer is an opinionated set of React components that take the AST and render it nicel.y