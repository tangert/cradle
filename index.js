const peg = require("pegjs")
const fs = require("fs")
const log = (s) => console.log(s)

const daggerParser = peg.generate(fs.readFileSync("grammar.pegjs", "utf8"))
const sampleInput = `step 1 -> step 2 (on ->) step 3`
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
}`

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
}`

const test4 = `
root {
 1 {
  11 {
   111
  },
 },
 2 {
  21 {
   211
  },
  22 {}
 },
}`

const test5 = `sweet`
const test6 = `r{1{},2{3{}}}`

const parsed = daggerParser.parse(test3)
log(test3)
log(parsed)
// cool, now you have the AST!
// now you can create a walking functioin like anything else