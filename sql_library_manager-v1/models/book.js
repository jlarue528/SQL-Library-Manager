'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  
  return Book;
};