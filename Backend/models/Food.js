const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Food = sequelize.define('Food', {
  name: DataTypes.STRING,
  price: DataTypes.FLOAT,
  image: DataTypes.STRING,
});

module.exports = Food;
