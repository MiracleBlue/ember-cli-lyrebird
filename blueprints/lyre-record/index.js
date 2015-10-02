var fs = require('fs');
var path = require('path');

function padZeros(value, places) {
  var output = '',
      zerosToAdd = places - value.toString().length;

  if (zerosToAdd > 0) {
    for (var index = 0; index < zerosToAdd; index++) output += '0';
  }

  return output + value;
}

function stripDashes(input) {
  return input.replace(/-/gi, '');
}

module.exports = {
  description: 'Creates a new record with an automatically incremented ID',

  locals: function(options) {
    var modelName = options.args[1];
    var capitalizedModelName = modelName.toUpperCase();
    var apiDirectory = path.resolve(options.project.root, 'server/datastore/api/' + modelName);
    var existingRecords = fs.readdirSync(apiDirectory);
    var incrementedId = existingRecords.length + 1;

    var fullRecordId = stripDashes(capitalizedModelName) + padZeros(incrementedId, 2);

    return {
      recordId: fullRecordId
    };
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
