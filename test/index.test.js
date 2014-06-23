var fs = require('fs')

var rocambole = require('rocambole')
  , tk = require('rocambole-token')
  , test = require('tape')

var commafirst = require('../')

test('reformats objects', function(t) {
  fs.readFile('./test/funky-object.js', onfile)

  function onfile(err, data) {
    if(err) {
      return t.fail(err.message)
    }

    var ast = rocambole.parse(data.toString())

    rocambole.recursive(ast, commafirst)

    t.equal(
        ast.toString()
      , fs.readFileSync('./test/expected-object.js').toString()
    )

    t.end()
  }
})


test('reformats variable declarations', function(t) {
  fs.readFile('./test/a-bunch-of-vars.js', onfile)

  function onfile(err, data) {
    if(err) {
      return t.fail(err.message)
    }

    var ast = rocambole.parse(data.toString())

    rocambole.moonwalk(ast, commafirst)


    t.equal(
        ast.toString()
      , fs.readFileSync('./test/expected-variables.js').toString()
    )

    t.end()
  }
})

test('reformats function args', function(t) {
  fs.readFile('./test/function-args.js', onfile)

  function onfile(err, data) {
    if(err) {
      return t.fail(err.message)
    }

    var ast = rocambole.parse(data.toString())

    rocambole.moonwalk(ast, commafirst)

    t.equal(
        ast.toString()
      , fs.readFileSync('./test/expected-functions.js').toString()
    )

    t.end()
  }
})
