Transforms your code, converting comma last to comma first.

Install with `npm i rocambole-commafirst`

```javascript
var commafirst = require('rocambole-commafirst')
  , rocambole = require('rocambole')

var source = fs.readFileSync('path/to/js/file.js').toString()

var ast = rocambole.parse(source)

commafirst.transform(ast)

ast.toString() // is your transformed source

// OR

rocambole.moonwalk(ast, commafirst)
```



