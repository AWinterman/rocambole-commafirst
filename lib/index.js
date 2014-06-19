var functions = require('./functions')
  , variables = require('./variables')
  , objects = require('./objects')
  , arrays = require('./arrays')

var rocambole = require('rocambole')

module.exports = commafirst

module.exports.transform = transform

function transform(ast) {
  rocambole.moonwalk(ast, transform_node)

  return ast
}

function commafirst(node) {
  objects(node)
  arrays(node)
  functions(node)
  variables(node)
}
