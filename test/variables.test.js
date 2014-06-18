var arrays = require('../lib/variables')
  , rocambole = require('rocambole')
  , update = require('../lib/update')

var test = require('tape')

test('reformats variable declarations', function(t) {
  var code = '' +
    "var a = 'hi'" +
    ", b = 2," +
    "  c = 3," +
    "  d = 12"

  var expected = '' +
    "var a = 'hi'" +
    '  , b = 2' +
    '  , c = 3' +
    '  , d = 12'

  var ast = rocambole.parse(code)

  rocambole.moonwalk(ast, function(node) {
    arrays(node)
  })

  t.equal(ast.toString(), expected)
}
