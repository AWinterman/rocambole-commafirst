var fs = require('fs')

var rocambole = require('rocambole')
  , tk = require('rocambole-token')
  , test = require('tape')

var commafirst = require('../')

test('reformats objects', function(t) {
  fs.readFile('./test/funky-object.js', onfile)

  function onfile(err, data) {
    if(err) {
      return t.fail(err.message)
    }

    var ast = rocambole.parse(data.toString())

    rocambole.moonwalk(ast, commafirst)

    t.equal(
        fs.readFileSync('./test/expected-object.js').toString()
      , ast.toString()
    )

    t.end()
  }
})

test('reformats variable declarations', function(t) {
  fs.readFile('./test/a-bunch-of-vars.js', onfile)

  function onfile(err, data) {
    if(err) {
      return t.fail(err.message)
    }

    var ast = rocambole.parse(data.toString())

    rocambole.moonwalk(ast, commafirst)

    console.error(ast.toString())
//
//     t.equal(
//         ast.toString()
//       , fs.readFileSync('./test/expected-variables.js').toString()
//     )

    t.end()
  }
})

// test('reformats function args', function(t) {
//   fs.readFile('./function-args.js', onfile)
//
//   function onfile(err, data) {
//     if(err) {
//       return t.fail(err.message)
//     }
//
//     var ast = rocambole.parse(data.toString())
//
//     rocambole.moonwalk(ast, function(node) {
//       if(node.type !== 'FunctionDeclaration') {
//         return
//       }
//
//       var children = node.params.map(function(point) {
//         return point.toString()
//       })
//
//       var arglist = children.join(', ')
//
//       var context = {}
//
//       context.leading_indent = tk.findPrev(
//           node.startToken
//         , ['WhiteSpace', 'Indent']
//       )
//
//       context.leading_indent = context.leading_indent ?
//         context.leading_indent.value :
//          ''
//
//       context.name = node.id.name
//       context.arglist = arglist
//
//       var output = mustache.render(
//           'function {{name}}({{arglist}}) {'
//         , context
//       )
//
//       if(output.length > 79) {
//         context.arglist = mustache.render(
//             '\n    {{ leading_indent }}' +
//             children.join('\n  {{ leading_indent }}, ') +
//             '\n{{ leading_indent }}'
//           , context
//         )
//
//         output = mustache.render(
//             'function {{name}}({{arglist}}) {'
//           , context
//         )
//       }
//
//       update(node, output)
//     })
//
//     t.end()
//   }
// })
//
// function update(node, str) {
//   var newToken = {
//       type: 'Custom' // can be anything (not used internally)
//     , value: str
//   }
//
//   // update linked list references
//   if(node.startToken.prev) {
//     node.startToken.prev.next = newToken
//     newToken.prev = node.startToken.prev
//   }
//
//   if(node.endToken.next) {
//     node.endToken.next.prev = newToken
//     newToken.next = node.endToken.next
//   }
//
//   node.startToken = node.endToken = newToken
// }
