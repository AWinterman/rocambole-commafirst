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

  leading_space = tk.findInBetween(
      tk.findPrev(node.startToken, 'LineBreak')
    , node.startToken
    , ['WhiteSpace', 'Indent']
  )

  var leading_indent = leading_space.value.length % 2 ?
    leading_space.value + ' ' :
    leading_space.value

  if(node.type === 'VariableDeclaration') {
    leading_indent += '  '
  }

  var had_comma

  while(token && token !== end) {
    next = token.next

    if(token.value === ',' && !token.broken) {
      console.error(node.type)
      if(token.prev.type === 'WhiteSpace') {
        tk.remove(token.prev)
      }

      // add a newline before the comma
      tk.before(token, {type: 'LineBreak', value: '\n'})
      token.broken = true

      // find the next whitespace and convert it to a single space.
      whitespace = tk.findNext(token, ['WhiteSpace', 'Indent'])
      whitespace.value = ' '

      linebreak = tk.findInBetween(token, end.prev, 'LineBreak')

      remove_break = linebreak &&
        '[]{}()'.indexOf(linebreak.prev.value) === -1 &&
        '[]{}()'.indexOf(linebreak.next.next.value) === -1

      if(remove_break) {
        tk.remove(linebreak)
      }

      tk.before(token, {type: 'WhiteSpace', value: leading_indent})
    }

    had_comma = true
    token = next
  }
//
//   token = start
//
//   while(had_comma && token && token !== end) {
//     next = token.next
//
//     if(token.value === ']' && node.type === 'ArrayExpression') {
//       token.prev.value = leading_indent
//     }
//
//     if(token.value === '}' && token.prev.type === 'WhiteSpace') {
//       token.prev.value = leading_indent
//     }
//
//     token = next
//   }

  // token = start
  //
  // var remove
  //   , next
//
//   while(token && token !== end) {
//     remove = token.type === 'LineBreak' &&
//       token.next &&
//       token.next.type === 'LineBreak'
//
//     next = token.next
//
//     if(remove) {
//       tk.remove(token)
//     }
//
//     token = next
//   }
}

function find_leading_indent_token(token) {
  return tk.findNext(
      tk.findPrev(token, 'LineBreak')
    , ['WhiteSpace', 'Indent']
  )
}
