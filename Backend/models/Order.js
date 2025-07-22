const { DataTypes } = require('sequelize');
const sequelize = require('./index');
const Food = require('./Food');

const Order = sequelize.define('Order', {
  items: DataTypes.JSON,
  totalAmount: DataTypes.FLOAT,
});

module.exports = Order;
