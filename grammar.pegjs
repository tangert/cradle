{
  // Used to arbitrarily flatten
  function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }
}

// Entry point for the grammar
start = Graph

Graph "graph" = children: (Group / Sequence)+ {
    return {
    	ast: children
    }
 } 


/*******************
      Group
*******************/
// Either seprate them by commas or just have a regular unit
Group "group" = children: (Node?_ (GroupOpener _ ( ((Group/Sequence)","_) / (Group/Sequence)_)* _ GroupCloser) _) {
	  return {
    	type: "group",
        start: children[0],
        children: flatten(children.slice(1)).filter(c => c 
                                                      && c.type !== 'whitespace' 
                                                      && c.type !== 'groupOpener'
                                                      && c.type !== 'groupCloser'
                                                      && c !== ',')
    }
}

GroupOpener = char: "{" {
	return {
    	type: "groupOpener",
      content: char
    }
}

GroupCloser = char: "}" {
	return {
    	type: "groupCloser",
      content: char
    }
}

/*******************
      Sequence
*******************/
// TODO?: the last node in the sequence is getting it's first letter cut off
Sequence "sequence"  = children:(NodeEdgeUnit _)+ {
	return {
    	type: "sequence",
        children: flatten(children.flat().filter(c => c.type !== 'whitespace').map(c => c.children))
    }
}

// Combines nodes and edges into tuples, which are then combined into sequences
NodeEdgeUnit "unit" = unit:(_ Node _ Edge*) {
	return {
    	type: 'nodeEdgeUnit',
    	children: unit.filter(n => n.type !== 'whitespace')
    }
}


/*******************
      Edges
*******************/
Edge "edge" = edge:(LabeledEdge / UnlabeledEdge) {
  return edge
}

// Labeled edges wrap arrows in parens and let you write text
LabeledEdge "labeled edge" = content:"("label:Node edge:UnlabeledEdge")" {
  return {
        type: "edge",
        variant: edge.variant,
        content: edge.content,
        label: label.content
    }
}

// This is basically a "regular" edge
UnlabeledEdge "unlabeled edge" = edge:(BiEdge/FEdge/BEdge) {
  return edge 
}

BiEdge "bidirectional edge" = content:"<->" {
  return { type: "edge", variant: "bidirectional", content } 
}

FEdge "forward edge" = content:"->" {
  return { type: "edge", variant: "forward", content } 
}

BEdge "backward edge" = content:"<-" {
  return { type: "edge", variant: "backward", content } 
}

/*******************
      Node
*******************/
// Joins words and spaces together
Node "node" = content:(Word InterwordWs)+ {
  return {
      type: "node",
      content: content.map(c => c[0] + c[1]).join('').trim()
    }
}

// Used for spaces within nodes themselves
InterwordWs "interword whitespace" = ws:_ {
  return ws.content.join("")
}

// 
Word "word" = letters:letter+ {
  return letters.join("")
}

letter "letter" = [A-Za-z0-9]

// We return an object so we can easily filter
_ "whitespace" = content: [ \t\n\r]* {
	return {
    	type: "whitespace",
      content
    }
}