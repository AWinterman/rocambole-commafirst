var functions = require('./functions')
  , rocambole = require('rocambole')
  , tk = require('rocambole-token')

module.exports = commafirst

module.exports.transform = transform

function transform(ast) {
  rocambole.moonwalk(ast, commafirst)

  return ast
}

var is_object_like = function(node) {
  var yes = node.type === 'ArrayExpression' ||
    node.type === 'VariableDeclaration' ||
    node.type === 'ObjectExpression'

  return yes
}

function commafirst(node) {
  var processed = functions(node)

  if(processed) {
    return
  }

  if(!is_object_like(node)) {
    return
  }

  var start = node.startToken
    , end = node.endToken
    , leading_indent
    , leading_space
    , remove_break
    , whitespace
    , linebreak
    , token

  token = start

  leading_space = tk.findNext(
      node.startToken
    , ['Numeric', 'String', 'Identifier']
  ).prev

  var leading_indent = leading_space.value.length % 2 ?
    leading_space.value + ' ' :
    leading_space.value

  if(node.type !== 'VariableDeclaration') {
    leading_space.value = leading_space.value + '  '
  }

  while(token !== end) {
    if (!token) break

    if(token.value === ',') {
      if(token.prev.type === 'WhiteSpace') {
        tk.remove(token.prev)
      }

      tk.before(token, {'type': 'LineBreak', value: '\n'})

      whitespace = tk.findNext(token.next, 'WhiteSpace')

      // Avoid clobbering array endings
      if(whitespace.next.value !== ']' && whitespace.next.value !== '}') {
        whitespace.value = ' '
      }

      linebreak = tk.findNext(token, 'LineBreak')

      remove_break = linebreak &&
        '[]{}'.indexOf(linebreak.prev.value) === -1 &&
        '[]{}'.indexOf(linebreak.next.next.value) === -1

      if(remove_break) {
        tk.remove(linebreak)
      }

      tk.before(token, {type: 'WhiteSpace', value: leading_indent})
    }

    if(token.value === ']' && node.type === 'ArrayExpression') {
      token.prev.value = leading_indent
    }

    if(token.value === '}' && token.prev.type === 'WhiteSpace') {
      token.prev.value = leading_indent
    }

    token = token.next
  }

  token = start

  var remove
    , next

  while(token !== end) {
    if (!token) break

    remove = token.type === 'LineBreak'
    remove = remove && token.next && token.next.type === 'LineBreak'

    next = token.next

    if(remove) {
      tk.remove(token)
    }

    token = next
  }
}

function find_leading_indent_token(token) {
  return tk.findNext(
      tk.findPrev(token, 'LineBreak')
    , ['WhiteSpace', 'Indent']
  )
}
