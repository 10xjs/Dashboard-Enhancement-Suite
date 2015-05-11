
module.exports = function(grunt) {

  grunt.initConfig({
    webpack: {
      default: {
        resolve: {
          extensions: ['', '.js', '.jsx']
        },
        entry: './src/options/options.js',
        output: {
          path: './extension/options/',
          filename: 'options.js'
        },
        module: {
          loaders: [
            { test: /\.css$/, loader: 'style!css' },
            { test: /\.jsx$/, loader: 'jsx-loader' },
            { test: /\.json$/, loader: 'json-loader'}
          ]
        },
        devtool: 'source-map'
      }
    }
  });

  grunt.registerTask('manifest', 'Create manifest.json file', function() {
    var manifestJSON = require('./src/manifest').manifestJSON;

    grunt.file.write('./extension/manifest.json', manifestJSON);
  });

  grunt.registerTask('updates', 'Create manifest.json file', function() {
    var updatesXML = require('./src/updates').updatesXML;

    grunt.file.write('./extension/updates.xml', updatesXML);
  });


  grunt.loadNpmTasks('grunt-webpack');
  grunt.registerTask('default', ['updates','manifest','webpack']);
};