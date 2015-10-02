module.exports = function(app) {
  var simpleRoute = require('../simpleRoute');

  return simpleRoute(app, '<%= modelNameSingular %>', '<%= modelNamePlural %>');
};
