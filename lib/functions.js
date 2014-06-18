var tk = require('rocambole-token')
  , mustache = require('mustache')
  , update = require('./update')

module.exports = function(node) {
  if(node.type !== 'FunctionDeclaration') {
    return false
  }

  var children = node.params.map(function(point) {
    return point.toString()
  })

  var arglist = children.join(', ')

  var context = {}

  context.leading_indent = tk.findPrev(
      node.startToken
    , ['WhiteSpace', 'Indent']
  )

  context.leading_indent = context.leading_indent ?
    context.leading_indent.value :
     ''

  context.name = node.id.name
  context.arglist = arglist

  var output = mustache.render(
      'function {{name}}({{arglist}}) {'
    , context
  )

  if(output.length > 79) {
    context.arglist = mustache.render(
        '\n    {{ leading_indent }}' +
        children.join('\n  {{ leading_indent }}, ') +
        '\n{{ leading_indent }}'
      , context
    )

    output = mustache.render(
        'function {{name}}({{arglist}}) {'
      , context
    )
  }

  update(node, output)

  return node
}
