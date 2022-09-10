const sequelize = require( '../config/connection' );
const { User, Ingredient, Recipe, RecipeIngredient, Unit } = require( '../models' );

const userData = require( './userData.json' );
const recipeIngredientData = require( './recipeIngredients.json' );
const ingredientData = require( './ingredients.json' );
const recipeData = require( './recipes.json' );
const unitData = require( './units.json' );

const seedUsers = async () => {
    await User.bulkCreate( userData, {
        individualHooks: true,
        returning: true
    } );
};

const seedUnits = async () => await Unit.bulkCreate( unitData );
const seedIngredients = async () => await Ingredient.bulkCreate( ingredientData );
const seedRecipes = async () => await Recipe.bulkCreate( recipeData );
const seedRecipeIngredients = async () => await RecipeIngredient.bulkCreate( recipeIngredientData );

const seedDatabase = async () => {

    await sequelize.sync( { force: true } );
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedUnits();
    console.log('\n----- UNITS SEEDED -----\n');

    await seedIngredients();
    console.log('\n----- INGREDIENTS SEEDED -----\n');

    await seedRecipes();
    console.log('\n----- RECIPES SEEDED -----\n');

    await seedRecipeIngredients();
    console.log('\n----- RECIPE-INGREDIENTS SEEDED -----\n');

    process.exit(0);
}

seedDatabase();