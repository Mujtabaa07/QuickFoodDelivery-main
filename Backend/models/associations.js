// This file is no longer needed since we switched to MongoDB
// All model associations are now handled through Mongoose populate
module.exports = {
  User: require('./User'),
  Restaurant: require('./Restaurant'),
  Category: require('./Category'),
  Food: require('./Food'),
  Order: require('./Order')
};
