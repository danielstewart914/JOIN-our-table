const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Ingredient extends Model {}

Ingredient.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        ingredient_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'ingredient'
    }
);

module.exports = Ingredient;