const User = require( './User' );
const Ingredient = require( './Ingredient' );
const Recipe = require( './Recipe' );
const RecipeIngredient = require( './RecipeIngredient' );
const Unit = require( './Unit' );

User.hasMany( Recipe, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
} );

Recipe.belongsTo( User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
} );

Recipe.belongsToMany( Ingredient, {
    through: {
        model: RecipeIngredient,
        unique: false
    },
    foreignKey: 'recipe_id',
    as: 'ingredients'
} );

Ingredient.belongsToMany( Recipe, {
    through: {
        model: RecipeIngredient,
        unique: false
    },
    foreignKey: 'ingredient_id',
    as: 'recipes'
} );

Unit.belongsToMany( Ingredient, {
    through: {
        model: RecipeIngredient,
        unique: false
    },
    foreignKey: 'unit_id',
    as: 'ingredients'
} );

Ingredient.belongsToMany( Unit, {
    through: {
        model: RecipeIngredient,
        unique: false
    },
    foreignKey: 'ingredient_id',
    as: 'unit'
} );

module.exports = { User, Ingredient, Recipe, RecipeIngredient, Unit };