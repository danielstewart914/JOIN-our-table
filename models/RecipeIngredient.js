const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class RecipeIngredient extends Model {}

RecipeIngredient.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        recipe_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'recipe',
                key: 'id'
            }
        },
        ingredient_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'ingredient',
                key: 'id'
            }
        },
        unit_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'unit',
                key: 'id'
            }
        },
        amount: {
            type: DataTypes.STRING(10),
            allowNull: false,
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'recipeingredient'
    }
);

module.exports = RecipeIngredient;