var babelCliDir = require('babel-cli/lib/babel/dir');
babelCliDir({ outDir: 'dist/', retainLines: true, sourceMaps: true }, [ 'dist/' ]);