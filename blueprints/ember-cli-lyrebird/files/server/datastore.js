var globSync  = require('glob').sync;
var path      = require('path');

var datastore = {};
var datastoreDirectory = './datastore/api';

var datastoreGlob = globSync(datastoreDirectory + '/**/*.json', { cwd: __dirname });

// Private methods

function sortById(models) {
  return models.sort(function (a, b) {
    if (a.name > b.name) return 1;
    if (a.name < b.name) return -1;
    // a must be equal to b
    return 0;
  });
}

function sortTheDataStore() {
  Object.keys(datastore).forEach(function(key) {
    if (datastore.hasOwnProperty(key)) datastore[key] = sortById(datastore[key]);
  });
}

function modelsExist(modelName) {
  return (datastore.hasOwnProperty(modelName) || !datastore[modelName].length);
}

function recordExists(modelName, id) {
  return (!modelsExist(modelName) || !find(modelName, id).length)
}

function findAll(modelName) {
  // Every action must perform a sort
  // Enforces synchronicity
  sortTheDataStore();

  var records = (datastore[modelName] || []).map(function(record) {
    return record['data'];
  });

  console.log(records);

  return records;
}

function find(modelName, id) {
  return (datastore[modelName] || []).filter(function(record) {
    try {
      return record.data.id === id;
    }
    catch (error) {
      return false;
    }
  })[0];
}

function indexOfRecord(modelName, id) {
  var recordIndex = null;

  // side effects incoming
  findAll(modelName).forEach(function(item, index) {
    if (item.data.id === id) recordIndex = index;
  });

  return recordIndex;
}

function newIdForRecord(modelName) {
  var capitalModelName = modelName.toUpperCase();

  if (!modelsExist(modelName)) return capitalModelName + '01';

  var modelStore = datastore[modelName];
  var lastUsedId = modelStore[modelStore.length - 1].id;

  // Takes the number at the end of the id, parses it into an integer, and adds 1.
  var newId = parseInt(lastUsedId.split(capitalModelName)[1]) + 1;

  // Add leading zero
  if (newId < 10) return capitalModelName + '0' + newId;
  return capitalModelName + newId;
}

function create(modelName, record) {
  if (!modelName) {
    console.error('modelName is a required argument');
    return;
  }

  var newRecord = record;

  newRecord.data.id = newIdForRecord(modelName);

  if (!datastore.hasOwnProperty(modelName)) datastore[modelName] = [newRecord];
  else datastore[modelName].push(newRecord);

  sortTheDataStore();

  return newRecord;
}

function update(modelName, id, record) {
  if (!modelName) {
    return console.error('modelName is a required argument');
  }

  if (!recordExists(modelName, id)) return false;

  var newRecord = record;
  var existingRecordIndex = indexOfRecord(modelName, id);

  // Should over-write the old one, thanks to primitive referencing
  datastore[modelName][existingRecordIndex] = newRecord;

  sortTheDataStore();

  return newRecord;
}

// todo: write a delete method
function remove() {
  return false;
}

// Set up the data store initially

// Warning, this code clearly has side-effects.  Not good, but it's not like it's permanent or anything.
// *cue scene 5 years later where a future programmer is reading this wondering what mess I've made*
datastoreGlob.forEach(function(jsonPath) {
  var fileName = path.basename(jsonPath);
  var modelName = jsonPath.split(datastoreDirectory + '/')[1].split('/' + fileName)[0];

  var loadedJson = require(jsonPath);
  var innerRecord = loadedJson;

  if (!datastore.hasOwnProperty(modelName)) datastore[modelName] = [innerRecord];
  else datastore[modelName].push(innerRecord);
});

sortTheDataStore();

module.exports = {
  find: function(modelName, id) {
    console.log('\n### datastore.find', modelName, id, '\n');
    if (!modelName) {
      return console.error('modelName is a required argument');
    }

    if (!id) {
      return {
        data: findAll(modelName)
      };
    }
    else {
      return find(modelName, id);
    }
  },
  create: create,
  update: update
};
