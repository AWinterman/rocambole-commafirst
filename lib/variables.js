var tk = require('rocambole-token')

var mustache = require('mustache')

var update = require('./update')

module.exports = function(node) {
  if(node.type !== 'VariableDeclaration') {
    return
  }

  var children = node.declarations.map(function(point) {
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

  var new_str = mustache.render(
      '{{ leading_indent }}var ' +
      children.join('\n  {{ leading_indent }}, ') + '\n'
    , indents
  )

  update(node, mustache.render(new_str, indents))
}


