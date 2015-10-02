module.exports = function(app, singularModelName, pluralModelName) {
  var express = require('express');
  var simpleRouter = express.Router();
  var datastore = require('./datastore');

  simpleRouter.get('/', function(req, res) {
    var output = datastore.find(singularModelName);

    res.send(output);
  });

  simpleRouter.post('/', function(req, res) {
    var newRecord = req.body[singularModelName];

    if (!newRecord) return res.status(500).send('model `' + singularModelName + '` not found in post body');

    var record = datastore.create(singularModelName, newRecord);

    if (!record) return res.status(500).send('record for `' + singularModelName + '` could not be created');

    res.send(record);
  });

  simpleRouter.get('/:id', function(req, res) {
    console.log('get', singularModelName, pluralModelName);
    var record = datastore.find(singularModelName, req.params.id);

    if (!record) return res.status(404).send(
      'record not found for model `' + singularModelName + '` with id: ' + req.params.id
    );

    res.send(record);
  });

  simpleRouter.put('/:id', function(req, res) {
    var id = req.params.id;
    var newRecord = req.body[singularModelName];

    if (!newRecord) return res.status(500).send('model `' + singularModelName + '` not found in post body');

    var oldRecord = datastore.find(singularModelName, id);

    if (!oldRecord) return res.status(404).send(
      'record not found for model `' + singularModelName + '` with id: ' + id
    );

    var record = datastore.update(singularModelName, id, newRecord);

    res.send(record);
  });

  simpleRouter.delete('/:id', function(req, res) {
    console.warn('delete functionality is not implemented yet');
    res.status(204).end();
  });

  app.use('/api/' + pluralModelName, simpleRouter);
};
