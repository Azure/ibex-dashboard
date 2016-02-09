var fs = require('fs');
var configFile = './config.json';
var AZURE_CONFIG_PROPS = ['APPINSIGHTS_INSTRUMENTATIONKEY', 'AAD_AUTH_CLIENTID'];

var EnvironmentVars = function (grunt) {
      var defaultConfig = {};
      var logStr = '';

      if(AZURE_CONFIG_PROPS && AZURE_CONFIG_PROPS.length > 0){
            AZURE_CONFIG_PROPS.forEach(function(item) {
              if (process.env[item])
                  defaultConfig[item] = process.env[item];
            });
            var msg = 'Saving File';
            var done = grunt.async();
            var jsonConfig = JSON.stringify(defaultConfig);

            try{
              fs.writeFile(configFile, jsonConfig, function (err) {
                  if (err) {
                      return console.log('Err: ' + err);
                  }

                  console.log("The config file was saved to !" + configFile);
                  done();
             });
            }catch(e){
              console.log('Error');
              grunt.verbose.or.write(msg).error().error(e.message);
              grunt.fail.warn('Something went wrong.');
            }
      }
};

module.exports = EnvironmentVars;
