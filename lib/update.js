var rocambole = require('rocambole')
  , go

module.exports = function update(node, str, obj) {
  var ast

  ast = rocambole.parse(str).body[0]

  if(obj) {
    ast = ast.expression
  }

  var start = ast.startToken
    , end = ast.endToken

  if(node.startToken.prev) {
    node.startToken.prev.next = start
    start.prev = node.startToken.prev
  }

  if(node.endToken.next) {
    node.endToken.next.prev = end
    end.next = node.endToken.next
  }

  node.startToken = start
  node.endToken = end
}
