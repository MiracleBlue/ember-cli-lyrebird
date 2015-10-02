module.exports = {
  description: 'Generates a mock endpoint for Lyrebird records',

  locals: function(options) {
    var recordId = options.args[1].toUpperCase() + '01';
    return {
      modelNameSingular: options.args[1],
      modelNamePlural: options.args[2],
      recordId: recordId
    }
  },

  fileMapTokens: function() {
    return {
      __recordId__: function(options) {
        return options.locals.recordId;
      }
    };
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
