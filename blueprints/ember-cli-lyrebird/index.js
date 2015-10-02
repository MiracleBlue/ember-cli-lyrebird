var Blueprint = require('ember-cli/lib/models/blueprint');
var isPackageMissing = require('ember-cli-is-package-missing');

module.exports = {
  description: 'Creates an extended version of Embers HTTP Mocks, including a DataStore',

  normalizeEntityName: function() {},

  // Largely borrowed from http-mock blueprint
  beforeInstall: function(options) {
    var serverBlueprint = Blueprint.lookup('server', {
      ui: this.ui,
      analytics: this.analytics,
      project: this.project
    });

    return serverBlueprint.install(options);
  },

  afterInstall: function(options) {

    if (!options.dryRun && isPackageMissing(this, 'express')) {
      return this.addPackagesToProject([
        { name: 'express', target: '^4.8.5' },
        { name: 'body-parser' }
      ]);
    }

  }

  // locals: function(options) {
  //   // Return custom template variables here.
  //   return {
  //     foo: options.entity.options.foo
  //   };
  // }

  // afterInstall: function(options) {
  //   // Perform extra work here.
  // }
};
