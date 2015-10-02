module.exports = {
  camelCase: function (input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  },
  stripDashes: function(input) {
    return input.replace(/-/gi, '');
  }
};
