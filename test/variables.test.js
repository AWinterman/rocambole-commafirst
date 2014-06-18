var arrays = require('../lib/variables')
  , rocambole = require('rocambole')
  , update = require('../lib/update')

var code = '' +
"var a = 'hi'" +
",  b =  2," +
"  c = 3," +
"  d = 12"

var ast = rocambole.parse(code)

// ast.toString() yeilds: var a = 'hi',  b =  2,  c = 3,  d = 12

rocambole.moonwalk(ast, function(node) {
  arrays(node)
})

// ast.toString() yeilds:
// var a = 'hi',  b =  2,  c = 3,  d = 12
