var tk = require('rocambole-token')
  , mustache = require('mustache')

var update = require('./update')

module.exports = function(node) {
  if(node.type !== 'ArrayExpression') {
    return node
  }

  var children = node.elements.map(function(point) {
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

  var new_str = '[\n  {{ leading_indent }}' +
    children.join('\n{{ leading_indent }}, ') +
    '\n{{ trailing_indent }}]'

  update(node, mustache.render(new_str, indents))

  return node
}
