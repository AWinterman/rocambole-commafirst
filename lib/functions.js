var tk = require('rocambole-token')
  , mustache = require('mustache')

var makeCheck = require('rocambole-token/makeCheck')

module.exports = function(node) {
  var should_process = makeCheck([
      'FunctionDeclaration'
    , 'CallExpressionl'
    , 'FunctionExpression'
  ])(node) && node.toString().split('\n')[0].length > 79

  if(!should_process) {
    return false
  }

  var leading_indent = tk.findPrev(
      node.startToken
    , ['WhiteSpace', 'Indent']
  )

  leading_indent.value = leading_indent.value + '  '

  var start = node.params[0].startToken
    , end = node.params[node.params.length - 1].endToken

  var token = start

  tk.before(start, {type: 'LineBreak', value: '\n'})
  tk.before(start, {type: leading_indent.type, value: '    ' + leading_indent.value})

  tk.after(end, {type: leading_indent.type, value: leading_indent.value})
  tk.after(end, {type: 'LineBreak', value: '\n'})

  while(token && token !== end) {
    if(token.value === ',') {
      tk.before(token, {type: 'LineBreak', value: '\n'})
      tk.before(token, {type: leading_indent.type, value: '  ' + leading_indent.value})
    }

    token = token.next
  }
}
