import path from 'path';

module.exports = {
    
    resolve: {
      fallback: {
        "path": require.resolve("path-browserify")
      }
    }
  };