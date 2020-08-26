{
  function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }
}

start = Graph

// BUG: the last node in teh sequence is getting iti's first letter cut off
// Finally build the graph
// This is where the magic happens!

Graph "graph" = children: (Group / Sequence)+ {
    return {
    	ast: children
    }
 } 

// ONCE AGAIN THE PROBLEM IS NESTED BRANCHES

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

// Either seprate them by commas or just have a regular unit
Sequence "sequence"  = children:(NodeEdgeUnit _)+ {
	return {
    	type: "sequence",
        // should this be responsibile for combing the liist into  one thing?
        // probably
        children: flatten(children.flat().filter(c => c.type !== 'whitespace').map(c => c.children))
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
_ "whitespace" = content: [ \t\n\r]* {
	return {
    	type: "whitespace",
      content
    }
}