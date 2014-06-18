var tk = require('rocambole-token')
  , mustache = require('mustache')

var update = require('./update')

module.exports = function(node) {
  if(node.type !== 'ObjectExpression') {
    return false
  }

  var properties = node.properties.map(function(point) {
    return point.toString()
  })

  var indents = {}

  indents.leading_indent = tk.findNext(
      node.startToken
    , ['WhiteSpace', 'Indent']
  ).value

  indents.trailing_indent = tk.findPrev(
      node.endToken
    , ['WhiteSpace', 'Indent']
  ).value

  var new_str = '{\n  {{ leading_indent }}' +
    properties.join('\n{{ leading_indent }}, ') +
    '\n{{ trailing_indent }}}'

  update(node, mustache.render(new_str, indents))

  return node
}
